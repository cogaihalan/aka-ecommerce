"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { useUserAddresses } from "@/hooks/use-user-addresses";
import { Address } from "@/types";
import { storefrontOrderService } from "@/lib/api/services/storefront/orders-client";
import { useUser } from "@clerk/nextjs";

// Form validation schema
const checkoutSchema = z.object({
  sameAsShipping: z.boolean().optional(),
  shippingMethod: z.string().min(1, "Please select a shipping method"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  orderNote: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// Shipping methods
export const SHIPPING_METHODS = [
  {
    id: "free",
    name: "Miễn phí vận chuyển",
    description: "Đơn hàng từ 1,000,000 VND",
    cost: 0,
  },
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    description: "Giao hàng tại Hà Nội - 30,000 VND",
    cost: 30000,
  },
];

// Payment methods - updated to match new API format
export const PAYMENT_METHODS = [
  {
    id: "COD",
    name: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
  },
  {
    id: "VNPAY",
    name: "VNPay",
    description: "Thanh toán qua VNPay",
  }
  // {
  //   id: "MOMO",
  //   name: "MoMo",
  //   description: "Thanh toán qua ví MoMo",
  // },
  // {
  //   id: "ZALO",
  //   name: "ZaloPay",
  //   description: "Thanh toán qua ZaloPay",
  // },
];

export function useCheckoutPage() {
  const router = useRouter();
  const { user, isSignedIn: isAuthenticated, isLoaded: authLoading } = useUser();
  const { items, getSubtotal, getShipping, getTax, getTotal, clearCart } =
    useCartStore();
  const {
    addresses,
    isLoading: addressesLoading,
    addAddress,
    updateAddress,
  } = useUserAddresses();

  // Form state
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [editingShippingAddress, setEditingShippingAddress] =
    useState<Address | null>(null);
  const [editingBillingAddress, setEditingBillingAddress] =
    useState<Address | null>(null);
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<Address | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsShipping: true,
      shippingMethod: "",
      paymentMethod: "",
      orderNote: "",
    },
  });

  const watchedSameAsShipping = watch("sameAsShipping");
  const watchedShippingMethod = watch("shippingMethod");
  const watchedPaymentMethod = watch("paymentMethod");

  // Get default addresses
  const defaultShippingAddress = addresses.find(
    (addr) => addr.type === "shipping" && addr.isDefault
  );
  const defaultBillingAddress = addresses.find(
    (addr) => addr.type === "billing" && addr.isDefault
  );

  // Initialize selected addresses with defaults
  useEffect(() => {
    if (defaultShippingAddress && !selectedShippingAddress) {
      setSelectedShippingAddress(defaultShippingAddress);
    }
    if (defaultBillingAddress && !selectedBillingAddress) {
      setSelectedBillingAddress(defaultBillingAddress);
    }
  }, [
    defaultShippingAddress,
    defaultBillingAddress,
    selectedShippingAddress,
    selectedBillingAddress,
  ]);

  // Redirect if not authenticated
  useEffect(() => {
    if (authLoading && !isAuthenticated) {
      router.push("/auth/sign-in?redirect_url=/checkout");
    }
  }, [isAuthenticated, authLoading, router]);

  // Filter shipping methods based on order conditions
  const getAvailableShippingMethods = () => {
    const subtotal = getSubtotal();

    return SHIPPING_METHODS.filter((method) => {
      // Free shipping is only available for orders over 1,000,000 VND
      if (method.id === "free") {
        return subtotal >= 1000000;
      }

      // Standard shipping is always available
      if (method.id === "standard") {
        return true;
      }

      return false;
    });
  };

  // Calculate shipping cost based on method and order total
  const calculateShippingCost = () => {
    const subtotal = getSubtotal();
    const selectedMethod = SHIPPING_METHODS.find(
      (method) => method.id === watchedShippingMethod
    );

    if (!selectedMethod) return 0;

    // Free shipping for orders over 1,000,000 VND
    if (selectedMethod.id === "free" && subtotal >= 1000000) {
      return 0;
    }

    return selectedMethod.cost;
  };

  // Calculate values
  const subtotal = getSubtotal();
  const shippingCost = calculateShippingCost();
  const tax = getTax();
  const total = getTotal();

  // Auto-select the first available shipping method
  useEffect(() => {
    const availableMethods = getAvailableShippingMethods();
    if (availableMethods.length > 0 && !watchedShippingMethod) {
      setValue("shippingMethod", availableMethods[0].id);
    }
  }, [subtotal, watchedShippingMethod, setValue]);

  // Handle address form submissions
  const handleShippingAddressSubmit = async (data: any) => {
    try {
      if (editingShippingAddress) {
        await updateAddress(editingShippingAddress.id, {
          ...data,
          type: "shipping",
        });
        toast.success("Shipping address updated successfully");
      } else {
        await addAddress({ ...data, type: "shipping", isDefault: true });
        toast.success("Shipping address added successfully");
      }
      setShowShippingForm(false);
      setEditingShippingAddress(null);
      // Auto-select the newly created/updated address
      const updatedAddresses = addresses.filter(
        (addr) => addr.type === "shipping"
      );
      const newAddress = updatedAddresses[updatedAddresses.length - 1];
      if (newAddress) {
        setSelectedShippingAddress(newAddress);
      }
    } catch (error) {
      toast.error("Failed to save shipping address");
    }
  };

  const handleBillingAddressSubmit = async (data: any) => {
    try {
      if (editingBillingAddress) {
        await updateAddress(editingBillingAddress.id, {
          ...data,
          type: "billing",
        });
        toast.success("Billing address updated successfully");
      } else {
        await addAddress({ ...data, type: "billing", isDefault: true });
        toast.success("Billing address added successfully");
      }
      setShowBillingForm(false);
      setEditingBillingAddress(null);
      // Auto-select the newly created/updated address
      const updatedAddresses = addresses.filter(
        (addr) => addr.type === "billing"
      );
      const newAddress = updatedAddresses[updatedAddresses.length - 1];
      if (newAddress) {
        setSelectedBillingAddress(newAddress);
      }
    } catch (error) {
      toast.error("Failed to save billing address");
    }
  };

  // Handle opening address forms
  const handleOpenShippingForm = (address?: Address) => {
    setEditingShippingAddress(address || null);
    setShowShippingForm(true);
  };

  const handleOpenBillingForm = (address?: Address) => {
    setEditingBillingAddress(address || null);
    setShowBillingForm(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: CheckoutFormValues) => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate addresses
    if (!selectedShippingAddress) {
      toast.error("Please select a shipping address to continue");
      return;
    }

    if (!data.sameAsShipping && !selectedBillingAddress) {
      toast.error("Please select a billing address to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data according to new API format
      const orderData = {
        cartItemId: items.map((item) => item.id), // Use cart item IDs
        paymentMethod: data.paymentMethod as "COD" | "VNPAY" | "MOMO" | "ZALO",
        recipientName: selectedShippingAddress.firstName + " " + selectedShippingAddress.lastName,
        recipientPhone: selectedShippingAddress.phone || "",
        shippingAddress: `${selectedShippingAddress.address1}${selectedShippingAddress.address2 ? `, ${selectedShippingAddress.address2}` : ""}`,
        note: data.orderNote || undefined,
      };

      // Create order using the new API
      const createdOrder = await storefrontOrderService.createOrder(orderData);

      // Clear cart and redirect to success page
      clearCart();
      toast.success("Order placed successfully!");

      // Redirect to success page with order ID
      router.push(`/checkout/success?order_id=${createdOrder.code}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle same as shipping checkbox change
  const handleSameAsShippingChange = (checked: boolean) => {
    setValue("sameAsShipping", checked);
    if (checked) {
      setSelectedBillingAddress(selectedShippingAddress);
    }
  };

  // Handle shipping address selection
  const handleShippingAddressChange = (addressId: string) => {
    const address = addresses.find((addr) => addr.id.toString() === addressId);
    setSelectedShippingAddress(address || null);
  };

  // Handle billing address selection
  const handleBillingAddressChange = (addressId: string) => {
    const address = addresses.find((addr) => addr.id.toString() === addressId);
    setSelectedBillingAddress(address || null);
  };

  return {
    // Form state
    form: {
      register,
      handleSubmit: handleSubmit(handleFormSubmit),
      watch,
      setValue,
      errors,
      watchedSameAsShipping,
      watchedShippingMethod,
      watchedPaymentMethod,
    },

    // Address state
    addresses: {
      all: addresses,
      shipping: addresses.filter((addr) => addr.type === "shipping"),
      billing: addresses.filter((addr) => addr.type === "billing"),
      selectedShipping: selectedShippingAddress,
      selectedBilling: selectedBillingAddress,
      defaultShipping: defaultShippingAddress,
      defaultBilling: defaultBillingAddress,
    },

    // Form modals
    modals: {
      showShippingForm,
      showBillingForm,
      editingShippingAddress,
      editingBillingAddress,
      setShowShippingForm,
      setShowBillingForm,
      setEditingShippingAddress,
      setEditingBillingAddress,
    },

    // Handlers
    handlers: {
      handleOpenShippingForm,
      handleOpenBillingForm,
      handleShippingAddressSubmit,
      handleBillingAddressSubmit,
      handleSameAsShippingChange,
      handleShippingAddressChange,
      handleBillingAddressChange,
    },

    // Cart and pricing
    cart: {
      items,
      subtotal,
      shippingCost,
      tax,
      total,
    },

    // Loading states
    loading: {
      auth: !authLoading,
      addresses: addressesLoading,
      submitting: isSubmitting,
    },

    // Auth state
    auth: {
      user,
      isAuthenticated,
    },

    // Constants
    constants: {
      SHIPPING_METHODS,
      PAYMENT_METHODS,
    },

    // Available shipping methods
    availableShippingMethods: getAvailableShippingMethods(),
  };
}

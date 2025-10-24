"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AddressForm } from "@/features/storefront/components/account/addresses/address-form";
import { OrderSummary } from "@/components/order/order-summary";
import { useCheckoutPage } from "@/hooks/use-checkout-page";
import { formatPrice } from "@/lib/utils";
import {
  Loader2,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const {
    form,
    addresses,
    modals,
    handlers,
    cart,
    loading,
    auth,
    constants,
    availableShippingMethods,
  } = useCheckoutPage();

  // Loading states
  if (loading.auth || loading.addresses) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading checkout...</span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!auth.isAuthenticated) {
    return null; // Will redirect
  }

  // Empty cart
  if (cart.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="w-full pb-8 space-y-6 lg:pb-16">
      <div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      <form onSubmit={form.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.shipping.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Select a shipping address:
                    </p>
                    <RadioGroup
                      value={addresses.selectedShipping?.id?.toString() || ""}
                      onValueChange={handlers.handleShippingAddressChange}
                      className="space-y-2"
                    >
                      {addresses.shipping.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <RadioGroupItem
                            value={address.id.toString()}
                            id={`shipping-${address.id}`}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`shipping-${address.id}`}
                              className="cursor-pointer"
                            >
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {address.firstName} {address.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.address1}
                                </p>
                                {address.address2 && (
                                  <p className="text-sm text-muted-foreground">
                                    {address.address2}
                                  </p>
                                )}
                                {address.phone && (
                                  <p className="text-sm text-muted-foreground">
                                    {address.phone}
                                  </p>
                                )}
                                {address.isDefault && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Default
                                  </Badge>
                                )}
                              </div>
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handlers.handleOpenShippingForm(address)
                            }
                          >
                            Edit
                          </Button>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlers.handleOpenShippingForm()}
                      className="w-full"
                    >
                      + Add New Shipping Address
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      No shipping addresses found. Please add one to continue.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlers.handleOpenShippingForm()}
                    >
                      Add Shipping Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsShipping"
                    checked={form.watchedSameAsShipping}
                    onCheckedChange={handlers.handleSameAsShippingChange}
                  />
                  <Label htmlFor="sameAsShipping">
                    My billing address is the same as shipping address
                  </Label>
                </div>

                {!form.watchedSameAsShipping && (
                  <div className="space-y-3">
                    {addresses.billing.length > 0 ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Select a billing address:
                        </p>
                        <RadioGroup
                          value={
                            addresses.selectedBilling?.id?.toString() || ""
                          }
                          onValueChange={handlers.handleBillingAddressChange}
                          className="space-y-2"
                        >
                          {addresses.billing.map((address) => (
                            <div
                              key={address.id}
                              className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                            >
                              <RadioGroupItem
                                value={address.id.toString()}
                                id={`billing-${address.id}`}
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`billing-${address.id}`}
                                  className="cursor-pointer"
                                >
                                  <div className="space-y-1">
                                    <p className="font-medium">
                                      {address.firstName} {address.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {address.address1}
                                    </p>
                                    {address.address2 && (
                                      <p className="text-sm text-muted-foreground">
                                        {address.address2}
                                      </p>
                                    )}
                                    {address.phone && (
                                      <p className="text-sm text-muted-foreground">
                                        {address.phone}
                                      </p>
                                    )}
                                    {address.isDefault && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Default
                                      </Badge>
                                    )}
                                  </div>
                                </Label>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handlers.handleOpenBillingForm(address)
                                }
                              >
                                Edit
                              </Button>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handlers.handleOpenBillingForm()}
                          className="w-full"
                        >
                          + Add New Billing Address
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
                          No billing addresses found. Please add one to
                          continue.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handlers.handleOpenBillingForm()}
                        >
                          Add Billing Address
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {form.watchedSameAsShipping && addresses.selectedShipping && (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Using shipping address as billing address
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <p>
                        {addresses.selectedShipping.firstName}{" "}
                        {addresses.selectedShipping.lastName}
                      </p>
                      <p>{addresses.selectedShipping.address1}</p>
                      {addresses.selectedShipping.address2 && (
                        <p>{addresses.selectedShipping.address2}</p>
                      )}
                      {addresses.selectedShipping.phone && (
                        <p>{addresses.selectedShipping.phone}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableShippingMethods.map((method) => {
                    const isFree =
                      method.id === "free" && cart.subtotal >= 1000000;
                    const cost = isFree ? 0 : method.cost;

                    return (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{method.name}</span>
                            {isFree && method.id === "free" && (
                              <Badge variant="secondary">Free</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                          <p className="text-sm font-medium">
                            {cost === 0 ? "Free" : formatPrice(cost)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            Selected
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {form.errors.shippingMethod && (
                  <p className="text-sm text-red-500 mt-2">
                    {form.errors.shippingMethod.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={form.watchedPaymentMethod}
                  onValueChange={(value) =>
                    form.setValue("paymentMethod", value)
                  }
                  className="space-y-3"
                >
                  {constants.PAYMENT_METHODS.map((method) => {
                    return (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <Label
                              htmlFor={method.id}
                              className="font-medium cursor-pointer"
                            >
                              {method.name}
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
                {form.errors.paymentMethod && (
                  <p className="text-sm text-red-500 mt-2">
                    {form.errors.paymentMethod.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...form.register("orderNote")}
                  placeholder="Any special instructions for your order..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              showShippingInfo={false}
              showSecurityBadges={false}
              showActionButtons={false}
              showClearCart={false}
              customShippingCost={cart.shippingCost}
              customTax={cart.tax}
              showItems={true}
              items={cart.items}
            />

            <div className="mt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  loading.submitting ||
                  !form.watchedShippingMethod ||
                  !form.watchedPaymentMethod
                }
              >
                {loading.submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Purchase"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Shipping Address Form Modal */}
      {modals.showShippingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddressForm
              address={
                modals.editingShippingAddress || ({ type: "shipping" } as any)
              }
              onSubmit={handlers.handleShippingAddressSubmit}
              onCancel={() => {
                modals.setShowShippingForm(false);
                modals.setEditingShippingAddress(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Billing Address Form Modal */}
      {modals.showBillingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddressForm
              address={
                modals.editingBillingAddress || ({ type: "billing" } as any)
              }
              onSubmit={handlers.handleBillingAddressSubmit}
              onCancel={() => {
                modals.setShowBillingForm(false);
                modals.setEditingBillingAddress(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

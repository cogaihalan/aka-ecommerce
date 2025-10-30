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
import { Loader2, MapPin, CreditCard, Truck, CheckCircle } from "lucide-react";
import { Address } from "@/types";
import { useI18n } from "@/components/providers/i18n-provider";

export default function CheckoutPage() {
  const { t } = useI18n();
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
          <span className="ml-2">{t("checkout.loading")}</span>
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
        <h1 className="text-3xl font-bold mb-2">{t("checkout.title")}</h1>
        <p className="text-muted-foreground">{t("checkout.subtitle")}</p>
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
                  {t("checkout.address.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.all.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{t("checkout.address.selectPrompt")}</p>
                    <RadioGroup
                      value={addresses.selected?.id?.toString() || ""}
                      onValueChange={(value) =>
                        handlers.handleAddressChange(
                          addresses.all.find(
                            (address) => address.id.toString() === value
                          )
                        )
                      }
                      className="grid grid-cols-2 gap-2"
                    >
                      {addresses.all.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start space-x-3 p-3 border rounded-lg shadow-lg hover:bg-muted/50"
                        >
                          <RadioGroupItem
                            value={address.id.toString()}
                            id={`address-${address.id}`}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`address-${address.id}`}
                              className="cursor-pointer"
                            >
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {address.recipientName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.recipientAddress}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.recipientPhone}
                                </p>
                                {address.isDefault && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {t("checkout.address.default")}
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
                              handlers.handleOpenAddressForm(address)
                            }
                          >
                            {t("checkout.address.edit")}
                          </Button>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlers.handleOpenAddressForm()}
                      className="w-full"
                    >
                      + {t("checkout.address.addNew")}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">{t("checkout.address.noneFound")}</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlers.handleOpenAddressForm()}
                    >
                      {t("checkout.address.add")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Fee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t("checkout.shipping.title")}
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
                              <Badge variant="secondary">{t("checkout.shipping.free")}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                          <p className="text-sm font-medium">
                            {cost === 0 ? t("checkout.shipping.free") : formatPrice(cost)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            {t("checkout.shipping.selected")}
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
                  {t("checkout.payment.title")}
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
                <CardTitle>{t("checkout.notes.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...form.register("orderNote")}
                  placeholder={t("checkout.notes.placeholder")}
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
                    {t("checkout.processing")}
                  </>
                ) : (
                  t("checkout.complete")
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Shipping Address Form Modal */}
      {modals.showAddressForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddressForm
              address={modals.editingAddress as Address}
              onSubmit={handlers.handleAddressSubmit}
              onCancel={() => {
                modals.setShowAddressForm(false);
                modals.setEditingAddress(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

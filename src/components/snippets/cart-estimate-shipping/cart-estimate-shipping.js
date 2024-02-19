import AccordionItem from 'snippets/accordion-item/accordion-item'
import EstimateShipping from 'snippets/estimate-shipping/estimate-shipping'

function CartEstimateShipping() {
  return (
    <div className="px-4 border-b pb-4 lg:pb-6 lg:px-6">
      <AccordionItem
        heading="Estimate Shipping Cost"
        wrapperClass="accordion-estimate-shipping border-b-0"
        headingIcon={true}
        iconName="icon-truck"
        classIcon="text-primary"
        titleClass="pt-4 pb-0 lg:pt-6"
        content={<EstimateShipping classInner="estimate-shipping-cart" />}
        isMaxHeight={false}
        isOverflow={false}
      />
    </div>
  )
}

export default CartEstimateShipping

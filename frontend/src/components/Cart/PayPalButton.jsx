import React from 'react'
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import { data } from 'react-router-dom';

const PayPalButton = ({amount, onSuccess, onError}) => {
  return (
    <PayPalScriptProvider options={{"client-id" : "AQc3p4N8ujV4dz9KN8rwIKdX1z2IbRivwet8jH8-rtanW8y7gQTonX7-B3WE-WgVPth-QFemSTl1kTjz" , currency: "USD"}}>
        <PayPalButtons style={{layout: "vertical"}} 
        createOrder={(data, actions) => {
            return actions.order.create({
                purchase_units: [{amount: {value: amount.toString(), currency_code: "USD",}}]
            })
        }}

        onApprove={(data, actions) => {
            return actions.order.capture().then(onSuccess)
        }}
        onError={onError}></PayPalButtons>
    </PayPalScriptProvider>
  )
}

export default PayPalButton
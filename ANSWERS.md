# Billing widget

The screen is a billing form titled "Account Information". The amount is "30.00". There is no currency, no country, and no security code. State or Province is required, and the control says "Select a state". The card number says "No dashes or spaces". The postal code says "no dashes". Card brand is its own Visa dropdown. The second address line has no label. The button says "Continue".

## a. Problems with this screen

**Security.** There is no CVV field shown. It may be collected later in the flow. The screen does not tell us whether the card fields are hosted by a payment provider. If the app handles the full card number itself, it could reach the server, logs, and screenshots, which makes PCI compliance harder. A hosted field would keep the number away from the app. The brand dropdown is separate from the number, so a customer can pick Visa and type a Mastercard. That mismatch needs validation. The number field also looks short for 16 digits.

**Usability.** Some customers outside the United States may have trouble entering a real billing address. There is no country field, state is required, and the dropdown is worded as a US state. "No dashes" asks the customer to change a normal ZIP+4 such as 12345-6789. The same kind of rule on the card number asks them to remove the spaces people type, and the spaces a browser autofill inserts. Actual validation needs checking. The amount has no currency, no tax, and no description of what is being bought. "Continue" does not say whether this step charges the card or opens a review page, and "Account Information" sounds like a profile form. The required asterisk for expiry sits on the year only, so the month looks optional. Address line 2 has no label. First name, middle initial, and last name are a weak match for the single name printed on the card.

**Performance.** The form itself is small. I cannot tell how fast it is from a screenshot. The main things to test are a slow payment response and a second click while the first request is still in flight. Check for an in-progress state and duplicate-charge protection; neither can be confirmed here.

The most severe visible bug: the amount has no currency. A customer sees 30.00 but cannot tell what they will pay. For a global company, this can cause an unexpected charge or a dispute. Unsafe card handling would be more severe if confirmed, but the image does not prove it.

## b. Sample test cases

**TC-01. US Visa happy path.**  
Precondition: sandbox account priced at 30.00 USD, valid test card with future expiry, and a supported US billing address.  
Steps: enter a valid test Visa number, future month and year, and the name on the card. Enter street, city, state, and ZIP. Click Continue and complete the next step if there is one.  
Expected: the total and currency are clear before confirming payment. One successful charge, with the confirmation showing the last 4 digits and 30.00 USD. Check that the full card number is not in application logs. The mock-up already misses the currency on this screen.

**TC-02. Bad input does not charge.**  
Steps: start with valid sandbox details and change one thing per run: an empty card number, an expired date, or Visa selected with a Mastercard test number. Reset to valid details between runs. Separately, try a valid card number with spaces and a valid ZIP+4 with a dash.  
Expected: missing or expired details show a field error and create no charge. A brand mismatch is caught or corrected before payment. Spaces in a valid card number are accepted or removed, and a valid dashed ZIP+4 is accepted for a US address. These last two are valid formats, not invalid-input cases.

**TC-03. Double click during payment.**  
Steps: use valid sandbox card and address details. At the step that actually starts payment, simulate a slow response and double-click the button.  
Expected: a loading state is shown and further clicks are blocked while waiting. There is only one payment for the purchase, and one confirmation.

## c. Product solution

Show the currency next to the amount and say what is being bought. If the button charges the card, label it "Pay 30.00 USD" using the actual currency. If it opens a review page, use "Review payment" and show the final total before payment. The server should set the amount and currency, and the confirmation should match.

If this form handles raw card data, use a hosted payment field (Stripe Payment Element, Adyen Drop-in, or Braintree Hosted Fields) so the card number does not reach the app. Ask for country first, and let the country decide whether state is required and how the postal code is checked. Detect the card brand from the number. Let the payment provider handle card verification and reject expired cards. Disable the pay button while payment is pending and show success or failure afterward. Also use server-side idempotency so repeated requests or retries after a timeout cannot create duplicate payments. Disabling the button alone is not enough.

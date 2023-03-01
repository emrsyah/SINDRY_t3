export function inputRupiahFormatted(input: any) {
  // Remove all non-numeric characters from the input
  var plainNumber = input.value.replace(/[^\d]/g, "");

  // Format the plain number into rupiah form
  var formattedValue = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
  }).format(plainNumber);
  

  // Update the input element with the formatted value
  input.value = formattedValue;
}

export default function transactionStatusConverter(
  type: "new" | "on_process" | "finished" | "picked_up"
) : string {
  if (type === "new") {
    return "Baru";
  } else if (type === "on_process") {
    return "Diproses";
  } else if (type == "finished") {
    return "Selesai";
  } else {
    return "Diambil";
  }
}

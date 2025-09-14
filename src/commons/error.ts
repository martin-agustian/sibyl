import Swal from "sweetalert2";

export async function showError(
  error: unknown, 
  fallbackMessage = "Upss.. something wrong, please refresh page"
) {
	const message = 
    error instanceof Error ? 
      error.message : typeof error === "string" ? 
        error : fallbackMessage;

	await Swal.fire({
		title: "Error!",
		icon: "error",
		text: message,
	});
}

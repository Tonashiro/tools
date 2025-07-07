export async function uploadToPinata(
  file: File | Blob,
  fileName?: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, fileName);

  const res = await fetch("/api/files", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload to Pinata");
  }

  const url = await res.json();
  return url;
}

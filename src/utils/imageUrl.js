const BASE_URL = import.meta.env.VITE_API_BASE_URL

export function getImageUrl(imageUrl)  {
 if (!imageUrl) {
   return ''
 }
 
 // Om bilden redan är en data-URL, returnera den som den är.
 if (imageUrl.startsWith('data:')) {
   return imageUrl
 }

 //stöd för gamla poster som redan har fullständig URL i databas
 if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
 )
 {
   return imageUrl
 }

 //backendsökväg för bilder som lagras på servern
 return `${BASE_URL}${imageUrl}`
}
export { cn } from "cn";

/*<=============== Types ===============> */
type GeoLocationRes = {
  lat: number;
  lon: number;
}

// Get user's current geoLocation.
export const getUserLocation = (): Promise<GeoLocationRes> => {
  return new Promise((resolve, reject) => {
    if(!navigator.geolocation) {
      reject("!Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      }, (error) => {
        reject(error.message)
      })
    }
  })
} 
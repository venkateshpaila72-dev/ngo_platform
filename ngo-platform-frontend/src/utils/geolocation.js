// Wraps the browser Geolocation API in a Promise so callers can `await` a
// position instead of juggling callbacks. Used when a volunteer submits
// proof-of-work, so the photo is tagged with where it was actually taken.

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        const messages = {
          1: 'Location permission was denied. Please allow location access to submit proof.',
          2: 'Location is currently unavailable. Try again in a moment.',
          3: 'Getting your location timed out. Try again.',
        };
        reject(new Error(messages[err.code] || 'Could not get your location.'));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, ...options }
    );
  });
}
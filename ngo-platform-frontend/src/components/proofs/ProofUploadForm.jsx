import { useState } from 'react';
import Button from '../common/Button.jsx';
import { uploadImage } from '../../api/cloudinary.js';
import { getCurrentPosition } from '../../utils/geolocation.js';

const STEP = {
  PHOTO: 'photo',
  LOCATION: 'location',
  DETAILS: 'details',
};

export default function ProofUploadForm({ onSubmit, submitting }) {
  const [step, setStep] = useState(STEP.PHOTO);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  const [storyText, setStoryText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setUploadError('');
  };

  const handleCapturePhoto = async () => {
    if (!file) return;
    setStep(STEP.LOCATION);
  };

  const handleCaptureLocation = async () => {
    setLocating(true);
    setLocationError('');
    try {
      const pos = await getCurrentPosition();
      setLocation(pos);
      setStep(STEP.DETAILS);
    } catch (err) {
      setLocationError(err.message);
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !location) return;

    setUploading(true);
    setUploadError('');
    try {
      const photoUrl = await uploadImage(file);
      await onSubmit({
        photoUrl,
        location: { lat: location.lat, lng: location.lng },
        storyText: storyText.trim() || undefined,
        feedbackRating,
      });
    } catch (err) {
      setUploadError(err.message || 'Something went wrong submitting your proof.');
    } finally {
      setUploading(false);
    }
  };

  const stepNumber = { [STEP.PHOTO]: 1, [STEP.LOCATION]: 2, [STEP.DETAILS]: 3 }[step];

  return (
    <div className="bg-card border border-borderc rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                n <= stepNumber ? 'bg-primary text-white' : 'bg-muted/20 text-muted'
              }`}
            >
              {n}
            </div>
            {n < 3 && (
              <div
                className={`h-0.5 flex-1 ${n < stepNumber ? 'bg-primary' : 'bg-muted/20'}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === STEP.PHOTO && (
        <div>
          <p className="font-heading font-semibold text-foreground mb-1">1. Add a photo</p>
          <p className="text-sm text-muted mb-4">
            Take or upload a photo showing the completed work.
          </p>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Proof preview"
              className="w-full max-h-64 object-cover rounded-lg border border-borderc mb-4"
            />
          ) : (
            <div className="w-full h-40 rounded-lg border-2 border-dashed border-borderc flex items-center justify-center text-sm text-muted mb-4">
              No photo selected
            </div>
          )}

          <label className="block">
            <span className="sr-only">Choose photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </label>

          <Button
            className="mt-4"
            fullWidth
            disabled={!file}
            onClick={handleCapturePhoto}
          >
            Continue
          </Button>
        </div>
      )}

      {step === STEP.LOCATION && (
        <div>
          <p className="font-heading font-semibold text-foreground mb-1">2. Confirm your location</p>
          <p className="text-sm text-muted mb-4">
            We tag proof submissions with GPS location to verify the work happened at the need site.
          </p>

          {location ? (
            <div className="bg-success/10 border border-success/30 rounded-lg px-4 py-3 mb-4 text-sm text-foreground">
              Location captured: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </div>
          ) : locationError ? (
            <div className="bg-critical/10 border border-critical/30 rounded-lg px-4 py-3 mb-4 text-sm text-critical">
              {locationError}
            </div>
          ) : null}

          <Button fullWidth loading={locating} onClick={handleCaptureLocation}>
            {location ? 'Recapture location' : 'Capture current location'}
          </Button>

          {location && (
            <Button
              variant="outline"
              fullWidth
              className="mt-3"
              onClick={() => setStep(STEP.DETAILS)}
            >
              Continue
            </Button>
          )}
        </div>
      )}

      {step === STEP.DETAILS && (
        <form onSubmit={handleSubmit}>
          <p className="font-heading font-semibold text-foreground mb-1">3. Add details</p>
          <p className="text-sm text-muted mb-4">
            Optional, but helps NGOs tell the story of this delivery.
          </p>

          <label className="block text-sm font-medium text-foreground mb-1">
            What happened here?
          </label>
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            rows={4}
            placeholder="e.g. Delivered 400L of drinking water to the community well site..."
            className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4"
          />

          <label className="block text-sm font-medium text-foreground mb-2">
            How would you rate how this delivery went?
          </label>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFeedbackRating(n)}
                className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
                  feedbackRating === n
                    ? 'bg-primary text-white'
                    : 'bg-muted/10 text-muted hover:bg-primary/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {uploadError && (
            <div className="bg-critical/10 border border-critical/30 rounded-lg px-4 py-3 mb-4 text-sm text-critical">
              {uploadError}
            </div>
          )}

          <Button type="submit" fullWidth loading={uploading || submitting}>
            Submit proof
          </Button>
        </form>
      )}
    </div>
  );
}
# Production Deployment Notes

## Photo capture-date sorting

The gallery now sorts photos by the date they were taken rather than the date they were uploaded.

JPEG uploads use the EXIF `DateTimeOriginal` value when available. Photos without a usable capture date fall back to their upload date.

### Database migration

Before deploying the updated gallery code to production, add the `taken_at` column:

```sql
ALTER TABLE photos
ADD COLUMN taken_at DATETIME NULL AFTER caption;

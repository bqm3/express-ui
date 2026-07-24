/** Slug trang Liên hệ (category) — chỉ 1 trang gắn ContactForm */
export const CONTACT_PAGE_SLUG = 'lien-he';

/** Google Maps embed trang Liên hệ */
export const CONTACT_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0541675030704!2d106.65963037480536!3d10.8071633893435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175294a17680537%3A0x1caddc4bfea2dc70!2zROG7i2NoIHbhu6UgZ-G7rWkgaMOgbmcgxJFpIE5nYSwg4bqkbiDEkOG7mSwgSMOgbiBRdeG7kWMsIE5o4bqtdCBC4bqjbiwgQW5oIMOaYyAtIEdsZXhwcmVzcw!5e0!3m2!1svi!2s!4v1784887617666!5m2!1svi!2s';

export function isContactPageSlug(slug?: string | null) {
  return Boolean(slug && slug === CONTACT_PAGE_SLUG);
}

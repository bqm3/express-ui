export type PostStatus = 'draft' | 'published' | 'archived';

export type ContactStatus = 'new' | 'processing' | 'done' | 'spam';

export type Carrier = 'DHL' | 'FEDEX' | 'UPS';

export enum AdminRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface MenuCategoryItem {
  id: number;
  name: string;
  slug: string;
  orderIndex: number;
  children?: MenuCategoryItem[];
}

export interface SidebarCategoryBlock {
  id: number;
  name: string;
  slug: string;
  orderIndex: number;
  posts: { id: number; slug: string; title: string }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  orderIndex: number;
  showInHeaderMenu?: boolean;
  showInSidebar?: boolean;
  shortDescription?: string | null;
  content?: string | null;
  children?: Category[];
  parent?: Category;
  postCount?: number;
  childCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  parentId?: number | null;
  orderIndex?: number;
  showInHeaderMenu?: boolean;
  showInSidebar?: boolean;
  shortDescription?: string | null;
  content?: string | null;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface Post {
  id: number;
  categoryId: number;
  category?: Category;
  slug: string;
  title: string;
  shortDescription: string | null;
  content: string;
  thumbnail: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  focusKeyword: string | null;
  schemaType: string | null;
  adsHeadline: string | null;
  adsDescription: string | null;
  adsImage: string | null;
  utmCampaign: string | null;
  conversionLabel: string | null;
  status: PostStatus;
  viewCount: number;
  publishedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  creator?: { id: number; fullName: string; username: string };
  updater?: { id: number; fullName: string; username: string };
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export type ResolveSlugType = 'category_list' | 'single_post';

export interface ResolvePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ResolveSlugResult =
  | {
      type: 'category_list';
      category: Category;
      posts: Post[];
      pagination: ResolvePagination;
    }
  | {
      type: 'single_post';
      post: Post;
      related_posts: Post[];
    };

export interface PostQuery extends PaginationQuery {
  categorySlug?: string;
  categoryId?: number;
  status?: PostStatus;
  search?: string;
  withDeleted?: boolean;
}

export interface CreatePostPayload {
  categoryId: number;
  slug: string;
  title: string;
  shortDescription?: string;
  content: string;
  thumbnail?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  focusKeyword?: string;
  schemaType?: string;
  adsHeadline?: string;
  adsDescription?: string;
  adsImage?: string;
  utmCampaign?: string;
  conversionLabel?: string;
  status?: PostStatus;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export interface ContactRequest {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  sourcePage: string | null;
  status: ContactStatus;
  assignedTo: number | null;
  noteInternal: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface CreateContactPayload {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  sourcePage?: string;
  recaptchaToken?: string;
}

export interface UpdateContactPayload {
  status?: ContactStatus;
  assignedTo?: number;
  noteInternal?: string;
}

export interface ContactQuery extends PaginationQuery {
  status?: ContactStatus;
  from?: string;
  to?: string;
  search?: string;
}

export interface TrackingEvent {
  timestamp: string;
  location?: string;
  description: string;
  statusCode?: string;
}

export interface TrackingResult {
  trackingNumber: string;
  carrier: Carrier;
  status: string;
  statusDescription: string;
  origin?: string;
  destination?: string;
  estimatedDelivery?: string | null;
  events: TrackingEvent[];
  raw?: unknown;
  cached?: boolean;
}

export interface TrackShipmentPayload {
  trackingNumber: string;
  carrier?: Carrier;
}

export interface TrackingLog {
  id: number;
  trackingNumber: string;
  carrier: Carrier;
  statusResult: Record<string, unknown> | null;
  createdAt: string;
  updatedAt?: string;
  ipAddress: string | null;
  isDeleted?: boolean;
}

export interface TrackingLogQuery extends PaginationQuery {
  carrier?: Carrier;
  trackingNumber?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  role: AdminRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: AdminUser;
}

export interface UploadResult {
  key: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface MediaTypeItem {
  id: number;
  code: string;
  name: string;
  description: string | null;
}

export interface MediaItem {
  id: number;
  mediaTypeId: number;
  mediaType?: MediaTypeItem;
  title: string | null;
  altText: string | null;
  url: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdBy: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaQuery extends PaginationQuery {
  type?: string;
  isActive?: boolean;
}

export type ContactChannelType =
  | 'phone'
  | 'zalo'
  | 'facebook'
  | 'email'
  | 'other';

export interface ContactChannel {
  id: number;
  name: string;
  channel: ContactChannelType;
  value: string;
  displayValue: string | null;
  orderIndex: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContactChannelPayload {
  name: string;
  channel: ContactChannelType;
  value: string;
  displayValue?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export type UpdateContactChannelPayload = Partial<CreateContactChannelPayload>;



export interface UserQuery extends PaginationQuery {
  search?: string;
  role?: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: AdminRole;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  password?: string;
  fullName: string;
  role: AdminRole;
}

export interface UpdateUserDto {
  fullName?: string;
  role?: AdminRole;
}

export interface ChangePasswordDto {
  newPassword: string;
}

export interface FooterBranch {
  id?: string;
  title?: string;
  address?: string;
  phone?: string;
}

export interface SiteSettings {
  header_title?: string;
  header_hotline?: string;
  header_hotline_link?: string;
  footer_hotline?: string;
  footer_hotline_link?: string;
  footer_branches?: string;
  show_google_map?: string | boolean;
  google_map_embed_url?: string;
  [key: string]: unknown;
}



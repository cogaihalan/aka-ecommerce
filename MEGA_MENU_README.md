# Prismic Mega Menu Implementation

## Tổng quan

Đã triển khai thành công Prismic custom type mega menu cho dự án ecommerce với các tính năng:

- ✅ Desktop mega menu với dropdown
- ✅ Mobile mega menu với collapsible sections
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Prismic CMS integration
- ✅ Custom styling

## Cấu trúc Files

### 1. Slice Components
- `src/slices/MegaMenu/` - Prismic slice cho mega menu
  - `model.json` - Cấu hình slice
  - `index.tsx` - Component render
  - `mocks.json` - Mock data

### 2. Navigation Components
- `src/components/navigation/mega-menu.tsx` - Desktop mega menu
- `src/components/navigation/mobile-mega-menu.tsx` - Mobile mega menu

### 3. Hooks
- `src/hooks/use-mega-menu.ts` - Hook để fetch mega menu data

### 4. Types
- `src/types/prismic.ts` - Prismic types cho mega menu

### 5. Custom Type
- `customtypes/mega_menu/index.json` - Prismic custom type definition

### 6. Styles
- `src/styles/mega-menu.css` - CSS styles cho mega menu

## Cách sử dụng

### 1. Trong Prismic Dashboard

1. **Tạo Custom Type**: Import `customtypes/mega_menu/index.json` vào Prismic
2. **Tạo Content**: Tạo document mega menu với các menu items
3. **Cấu hình Menu Items**:
   - Label: Tên menu item
   - Link: URL hoặc internal link
   - Has Mega Menu: Bật/tắt dropdown
   - Layout Type: Chọn layout (columns, featured_products, categories, mixed)
   - Columns: Số cột (1-4)
   - Featured Image: Hình ảnh nổi bật
   - Description: Mô tả
   - Section Title: Tiêu đề section
   - Section Links: Danh sách links (mỗi dòng một link)
   - Is Featured: Đánh dấu link nổi bật
   - Icon: Icon cho menu item

### 2. Trong Code

Mega menu đã được tích hợp vào `StorefrontHeader` component và sẽ tự động hiển thị khi có data từ Prismic.

```tsx
// Desktop mega menu
<MegaMenu menuItems={megaMenuData.menu_items} />

// Mobile mega menu  
<MobileMegaMenu menuItems={megaMenuData.menu_items} />
```

### 3. Customization

#### Styling
Chỉnh sửa `src/styles/mega-menu.css` để thay đổi giao diện:

```css
.mega-menu-content {
  /* Customize dropdown styling */
}

.mega-menu-link {
  /* Customize link styling */
}
```

#### Layout Types
Hỗ trợ 4 layout types:
- `columns`: Layout dạng cột
- `featured_products`: Layout sản phẩm nổi bật
- `categories`: Layout danh mục
- `mixed`: Layout hỗn hợp

## Tính năng

### Desktop
- Hover để hiển thị mega menu
- Smooth animations
- Responsive grid layout
- Featured content support
- Icon support

### Mobile
- Collapsible sections
- Touch-friendly interface
- Sheet-based navigation
- Optimized for mobile UX

### Accessibility
- Keyboard navigation support
- Focus management
- Screen reader friendly
- ARIA attributes

## Performance

- Lazy loading với dynamic imports
- Optimized Prismic client với caching
- Efficient re-renders
- Mobile-first responsive design

## Troubleshooting

### Mega menu không hiển thị
1. Kiểm tra Prismic repository name trong `.env`
2. Đảm bảo đã tạo content trong Prismic
3. Kiểm tra network requests trong DevTools

### Styling issues
1. Kiểm tra CSS import trong `globals.css`
2. Đảm bảo Tailwind classes được apply đúng
3. Kiểm tra z-index conflicts

### TypeScript errors
1. Chạy `npm run type-check`
2. Đảm bảo Prismic types được import đúng
3. Kiểm tra interface definitions

## Development

### Thêm tính năng mới
1. Cập nhật `model.json` cho slice
2. Thêm fields vào custom type
3. Update TypeScript interfaces
4. Implement trong components
5. Test responsive behavior

### Testing
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## Support

Để được hỗ trợ, vui lòng:
1. Kiểm tra console errors
2. Verify Prismic connection
3. Check component props
4. Review network requests

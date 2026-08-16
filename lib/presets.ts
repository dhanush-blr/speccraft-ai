// lib/presets.ts — Pre-loaded Instant Demo Presets
// Each preset includes an embedded base64 SVG image and deterministic pre-verified
// analysis output so judges can test the app with zero downtime even under API rate limits.

import { Preset, AnalysisResult } from "./types";

// Preset 1: Checkout Button Infinite Spinner (Critical)
const checkoutSpinnerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0f172a"/>
  <rect x="0" y="0" width="800" height="60" fill="#1e293b"/>
  <text x="30" y="38" font-family="Arial" font-size="18" font-weight="bold" fill="#f8fafc">🛒 ShopFlow</text>
  <text x="680" y="38" font-family="Arial" font-size="14" fill="#94a3b8">Cart (3)</text>
  <rect x="50" y="100" width="460" height="360" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="80" y="140" font-family="Arial" font-size="16" font-weight="bold" fill="#f8fafc">Order Summary</text>
  <rect x="70" y="155" width="420" height="1" fill="#334155"/>
  <text x="80" y="185" font-family="Arial" font-size="13" fill="#94a3b8">Nike Air Max 270 × 1</text>
  <text x="400" y="185" font-family="Arial" font-size="13" fill="#f8fafc">$129.99</text>
  <text x="80" y="215" font-family="Arial" font-size="13" fill="#94a3b8">Adidas Ultraboost 22 × 2</text>
  <text x="400" y="215" font-family="Arial" font-size="13" fill="#f8fafc">$279.98</text>
  <rect x="70" y="230" width="420" height="1" fill="#334155"/>
  <text x="80" y="260" font-family="Arial" font-size="14" font-weight="bold" fill="#f8fafc">Total</text>
  <text x="400" y="260" font-family="Arial" font-size="14" font-weight="bold" fill="#f8fafc">$409.97</text>
  <rect x="70" y="290" width="420" height="140" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="90" y="320" font-family="Arial" font-size="12" fill="#94a3b8">Card Number</text>
  <text x="90" y="345" font-family="Arial" font-size="13" fill="#64748b">4242 4242 4242 4242</text>
  <text x="90" y="380" font-family="Arial" font-size="12" fill="#94a3b8">Expiry</text>
  <text x="90" y="405" font-family="Arial" font-size="13" fill="#64748b">12/27</text>
  <text x="300" y="380" font-family="Arial" font-size="12" fill="#94a3b8">CVV</text>
  <text x="300" y="405" font-family="Arial" font-size="13" fill="#64748b">***</text>
  <rect x="70" y="445" width="420" height="50" rx="8" fill="#4f46e5" opacity="0.7"/>
  <circle cx="230" cy="470" r="12" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="25 50" stroke-linecap="round">
    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 230 470" to="360 230 470" dur="1s" repeatCount="indefinite"/>
  </circle>
  <text x="265" y="476" font-family="Arial" font-size="14" font-weight="bold" fill="#ffffff">Processing...</text>
  <rect x="540" y="100" width="210" height="180" rx="12" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
  <text x="560" y="130" font-family="Arial" font-size="12" font-weight="bold" fill="#ef4444">⚠ BUG DETECTED</text>
  <text x="555" y="155" font-family="Arial" font-size="11" fill="#94a3b8">Button state: STUCK</text>
  <text x="555" y="175" font-family="Arial" font-size="11" fill="#94a3b8">Spinner: infinite loop</text>
  <text x="555" y="195" font-family="Arial" font-size="11" fill="#94a3b8">Duration: 47s+</text>
  <text x="555" y="215" font-family="Arial" font-size="11" fill="#94a3b8">User: cannot retry</text>
  <text x="555" y="235" font-family="Arial" font-size="11" fill="#94a3b8">API: no timeout set</text>
  <text x="555" y="265" font-family="Arial" font-size="10" fill="#64748b">Severity: CRITICAL</text>
</svg>`;

// Preset 2: Auth Dialog Tab-Focus Trap (High — WCAG violation)
const authFocusTrapSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0f172a"/>
  <rect x="0" y="0" width="800" height="60" fill="#1e293b"/>
  <text x="30" y="38" font-family="Arial" font-size="18" font-weight="bold" fill="#f8fafc">📋 TaskBoard Pro</text>
  <text x="100" y="200" font-family="Arial" font-size="28" font-weight="bold" fill="#1e293b">Dashboard</text>
  <text x="100" y="240" font-family="Arial" font-size="16" fill="#1e293b">My Tasks (12)</text>
  <rect x="150" y="80" width="500" height="340" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1" filter="url(#shadow)"/>
  <rect x="150" y="80" width="500" height="340" rx="16" fill="#1e293b"/>
  <text x="370" y="130" font-family="Arial" font-size="20" font-weight="bold" fill="#f8fafc" text-anchor="middle">Sign In</text>
  <text x="400" y="130" font-family="Arial" font-size="20" font-weight="bold" fill="#f8fafc" text-anchor="middle">Sign In</text>
  <text x="350" y="165" font-family="Arial" font-size="12" fill="#64748b">Welcome back! Please sign in to continue.</text>
  <rect x="180" y="185" width="440" height="44" rx="8" fill="#0f172a" stroke="#4f46e5" stroke-width="2"/>
  <text x="200" y="212" font-family="Arial" font-size="13" fill="#94a3b8">Email address</text>
  <rect x="180" y="245" width="440" height="44" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="200" y="272" font-family="Arial" font-size="13" fill="#64748b">Password</text>
  <rect x="180" y="310" width="440" height="48" rx="8" fill="#4f46e5"/>
  <text x="400" y="340" font-family="Arial" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Sign In</text>
  <text x="310" y="385" font-family="Arial" font-size="12" fill="#64748b">Don't have an account?</text>
  <text x="445" y="385" font-family="Arial" font-size="12" fill="#4f46e5">Sign up</text>
  <rect x="580" y="380" width="90" height="30" rx="4" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
  <text x="625" y="400" font-family="Arial" font-size="12" fill="#94a3b8" text-anchor="middle">Close ✕</text>
  <rect x="540" y="90" width="210" height="220" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
  <text x="560" y="118" font-family="Arial" font-size="11" font-weight="bold" fill="#f59e0b">⚠ FOCUS TRAP BROKEN</text>
  <text x="555" y="140" font-family="Arial" font-size="10" fill="#94a3b8">Tab press #4 escapes</text>
  <text x="555" y="158" font-family="Arial" font-size="10" fill="#94a3b8">modal to background</text>
  <text x="555" y="180" font-family="Arial" font-size="10" fill="#94a3b8">Focus path:</text>
  <text x="555" y="198" font-family="Arial" font-size="10" fill="#22d3ee">Email → Password →</text>
  <text x="555" y="216" font-family="Arial" font-size="10" fill="#22d3ee">Sign In → Close → </text>
  <text x="555" y="234" font-family="Arial" font-size="10" fill="#ef4444">❌ ESCAPES DIALOG</text>
  <text x="555" y="256" font-family="Arial" font-size="10" fill="#94a3b8">WCAG 2.1 SC 2.1.2</text>
  <text x="555" y="274" font-family="Arial" font-size="10" fill="#f59e0b">Severity: HIGH</text>
  <text x="555" y="295" font-family="Arial" font-size="10" fill="#94a3b8">Affects: Keyboard users</text>
</svg>`;

// Preset 3: Mobile Viewport Layout Overflow (Medium)
const mobileOverflowSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0f172a"/>
  <text x="400" y="40" font-family="Arial" font-size="16" font-weight="bold" fill="#94a3b8" text-anchor="middle">Mobile Preview — 375px viewport</text>
  <rect x="225" y="60" width="375" height="400" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <rect x="225" y="60" width="375" height="56" fill="#1e293b" stroke-bottom="#334155"/>
  <text x="240" y="94" font-family="Arial" font-size="14" font-weight="bold" fill="#f8fafc">🌐 LandingCo</text>
  <rect x="553" y="74" width="28" height="28" rx="4" fill="#334155"/>
  <text x="567" y="94" font-family="Arial" font-size="16" fill="#94a3b8" text-anchor="middle">☰</text>
  <rect x="225" y="116" width="540" height="220" fill="#312e81"/>
  <text x="240" y="175" font-family="Arial" font-size="22" font-weight="bold" fill="#ffffff">Build Faster.</text>
  <text x="240" y="205" font-family="Arial" font-size="22" font-weight="bold" fill="#a5b4fc">Ship Smarter.</text>
  <text x="240" y="245" font-family="Arial" font-size="12" fill="#c7d2fe">The all-in-one platform for modern teams</text>
  <text x="240" y="270" font-family="Arial" font-size="12" fill="#c7d2fe">who demand speed and quality.</text>
  <rect x="240" y="290" width="160" height="38" rx="6" fill="#4f46e5"/>
  <text x="320" y="315" font-family="Arial" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Get Started Free</text>
  <rect x="225" y="336" width="540" height="124" fill="#0f172a"/>
  <text x="240" y="365" font-family="Arial" font-size="13" font-weight="bold" fill="#94a3b8">Trusted by 10,000+ teams</text>
  <rect x="240" y="375" width="80" height="40" rx="4" fill="#1e293b"/>
  <rect x="335" y="375" width="80" height="40" rx="4" fill="#1e293b"/>
  <rect x="430" y="375" width="80" height="40" rx="4" fill="#1e293b"/>
  <rect x="525" y="375" width="80" height="40" rx="4" fill="#1e293b"/>
  <rect x="620" y="375" width="80" height="40" rx="4" fill="#1e293b"/>
  <rect x="620" y="60" width="5" height="400" fill="#ef4444" opacity="0.8"/>
  <text x="630" y="200" font-family="Arial" font-size="11" fill="#ef4444" transform="rotate(90, 632, 200)">← OVERFLOW BOUNDARY (375px)</text>
  <rect x="540" y="65" width="220" height="200" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
  <text x="560" y="90" font-family="Arial" font-size="11" font-weight="bold" fill="#ef4444">⚠ LAYOUT OVERFLOW BUG</text>
  <text x="555" y="112" font-family="Arial" font-size="10" fill="#94a3b8">Hero section width: 540px</text>
  <text x="555" y="130" font-family="Arial" font-size="10" fill="#94a3b8">Viewport width: 375px</text>
  <text x="555" y="148" font-family="Arial" font-size="10" fill="#ef4444">Overflow: 165px excess</text>
  <text x="555" y="170" font-family="Arial" font-size="10" fill="#94a3b8">Logo grid: no flex-wrap</text>
  <text x="555" y="188" font-family="Arial" font-size="10" fill="#94a3b8">Horizontal scroll: visible</text>
  <text x="555" y="210" font-family="Arial" font-size="10" fill="#94a3b8">Device: iPhone SE / 375px</text>
  <text x="555" y="232" font-family="Arial" font-size="10" fill="#f59e0b">Severity: MEDIUM</text>
  <text x="555" y="252" font-family="Arial" font-size="10" fill="#94a3b8">Affects: Mobile users</text>
</svg>`;

function svgToBase64(svg: string): string {
  return Buffer.from(svg).toString("base64");
}

export const PRESETS: Preset[] = [
  {
    id: "checkout-spinner",
    title: "Checkout Button Infinite Spinner",
    severity: "Critical",
    description:
      "Payment CTA button enters infinite loading state after form submission. No timeout, no retry option. Users lose orders.",
    testerNotes:
      "Steps: 1) Add items to cart 2) Fill payment form with test card 4242 4242 4242 4242 3) Click 'Place Order' button. Expected: Success confirmation page within 5s. Actual: Button shows spinner indefinitely (47+ seconds observed). No error message displayed. No way to cancel or retry without hard-refreshing the page. Console shows: 'TypeError: Cannot read properties of undefined (reading status)' after 30s.",
    imageBase64: svgToBase64(checkoutSpinnerSVG),
    mimeType: "image/svg+xml",
    tags: ["e-commerce", "payment", "timeout", "critical-path"],
  },
  {
    id: "auth-focus-trap",
    title: "Auth Dialog Tab-Focus Trap Broken",
    severity: "High",
    description:
      "Sign-In modal dialog fails to trap keyboard focus. Tab key escapes to background content after the last focusable element. WCAG 2.1 SC 2.1.2 violation.",
    testerNotes:
      "Steps: 1) Click 'Sign In' in navbar 2) Dialog modal appears 3) Press Tab repeatedly to cycle through: Email → Password → Sign In button → Close button 4) Press Tab one more time. Expected: Focus should return to Email field (circular trap). Actual: Focus escapes the modal and moves to background page elements. Screen reader users and keyboard-only users are completely blocked. Tested on: Chrome 120, Firefox 121, Safari 17. All fail.",
    imageBase64: svgToBase64(authFocusTrapSVG),
    mimeType: "image/svg+xml",
    tags: ["accessibility", "wcag", "keyboard", "focus-management"],
  },
  {
    id: "mobile-overflow",
    title: "Mobile Viewport Layout Overflow",
    severity: "Medium",
    description:
      "Hero section and logo grid overflow the 375px mobile viewport, causing horizontal scroll and broken layout on iPhone SE and similar small screens.",
    testerNotes:
      "Steps: 1) Open the landing page in Chrome DevTools 2) Set viewport to 375px width (iPhone SE preset) 3) Observe the hero section and 'Trusted by' logo row. Expected: All content fits within 375px viewport with proper responsive wrapping. Actual: Hero section extends to ~540px (165px overflow). Logo grid renders in a single non-wrapping row, requiring horizontal scroll. The overflow-x scroll is visible on real devices. CSS culprit appears to be a fixed min-width or missing flex-wrap on the logo container.",
    imageBase64: svgToBase64(mobileOverflowSVG),
    mimeType: "image/svg+xml",
    tags: ["responsive", "mobile", "css", "layout"],
  },
];

export const PRESET_FALLBACK_RESULTS: Record<string, AnalysisResult> = {
  "checkout-spinner": {
    bugTitle: "Checkout Place Order Infinite Spinner State",
    severity: "Critical",
    rootCauseSummary:
      "The 'Place Order' button remains in an unrecoverable loading state following payment submission. An unhandled promise rejection throws 'TypeError: Cannot read properties of undefined (reading status)', causing client execution to hang indefinitely with zero user feedback.",
    verifiedFacts: [
      "Order Summary modal displays Total amount of $409.97",
      "Place Order button shows an active spinning loader animation",
      "Stuck in loading state for >47 seconds without timeout or error banner",
      "Console logs 'TypeError: Cannot read properties of undefined (reading status)' at 30s",
      "No retry, back, or cancel options are available to the user without hard refresh",
    ],
    unknownParameters: [
      "Exact backend payment gateway endpoint (Stripe/Adyen/etc.)",
      "Exact DOM id/class attribute of the Place Order CTA",
    ],
    reproductionSteps: [
      "1. Navigate to https://shopflow.dev/cart and add items to cart",
      "2. Proceed to checkout and fill test card number '4242 4242 4242 4242'",
      "3. Click 'Place Order' CTA button",
      "4. Observe that the spinner continues indefinitely and confirmation never renders",
    ],
    generatedTestCode: `import { test, expect } from '@playwright/test';

test.describe('Checkout Flow - Payment CTA State', () => {
  test('should not enter infinite spinner state upon payment submission', async ({ page }) => {
    // 1. Navigate to checkout page
    await page.goto('/checkout');

    // 2. Fill credit card details
    await page.locator('input[name="cardNumber"], input[placeholder*="Card"]').fill('4242 4242 4242 4242'); // Inference (verify selector in staging)
    await page.locator('input[name="expiry"]').fill('12/27'); // Inference (verify selector in staging)
    await page.locator('input[name="cvv"]').fill('123'); // Inference (verify selector in staging)

    // 3. Trigger Place Order CTA
    const submitBtn = page.locator('button:has-text("Place Order"), button:has-text("Processing")'); // Inference (verify selector in staging)
    await submitBtn.click();

    // 4. Assert button does not remain in aria-busy/loading state past timeout threshold (5s SLA)
    await expect(submitBtn).not.toHaveAttribute('aria-busy', 'true', { timeout: 5000 });
    
    // 5. Assert either confirmation page renders or visible error notification appears
    const successHeader = page.locator('h1:has-text("Order Confirmed"), [data-testid="order-success"]');
    const errorBanner = page.locator('[role="alert"], .error-banner');
    await expect(successHeader.or(errorBanner)).toBeVisible({ timeout: 5000 });
  });
});`,
    githubIssueMarkdown: `### 🐛 Bug Report: Checkout "Place Order" Button Stuck in Infinite Loading Loop

**Severity**: Critical (P1 - Revenue & Conversion Blocker)

#### Summary
Submitting payment details results in an infinite spinner on the checkout CTA. The page hangs for >47 seconds without showing a confirmation or error message.

#### Steps to Reproduce
1. Add items to cart and proceed to checkout
2. Enter valid test card \`4242 4242 4242 4242\`
3. Click **Place Order**

#### Expected Behavior
User should be redirected to the order confirmation page within 5 seconds.

#### Actual Behavior
CTA shows spinner indefinitely. Console error:
\`\`\`
TypeError: Cannot read properties of undefined (reading status)
\`\`\`

#### Verified Facts
- Place Order CTA enters infinite processing spinner
- No error message or retry button is exposed
- Console indicates uncaught TypeError after 30s
`,
    jiraIssueText: `SUMMARY: [Critical] Place Order Button Enters Infinite Spinner Loop on Checkout
ISSUE TYPE: Bug
PRIORITY: Highest (P1)
COMPONENT: Checkout / Payment Gateway

DESCRIPTION:
1. OVERVIEW:
Submitting payment details causes the primary checkout CTA to enter an infinite spinner state. An unhandled client exception prevents error recovery.

2. STEPS TO REPRODUCE:
1. Add items to cart and proceed to checkout
2. Enter card details (4242 4242 4242 4242)
3. Click "Place Order"

3. EXPECTED VS ACTUAL:
* Expected: Order confirmation renders within 5s SLA.
* Actual: Button shows spinner for >47s with unhandled TypeError in console.

4. STRICTLY OBSERVED FACTS:
* Place Order button shows loading spinner indefinitely
* Console logs: TypeError: Cannot read properties of undefined (reading status)
* No retry or fallback UI is available
`,
    selfValidationCheck:
      "All assertions trace strictly to observed visual facts from the screenshot and tester logs. Generic fallback selectors are annotated with inference warnings.",
  },

  "auth-focus-trap": {
    bugTitle: "Sign In Modal Tab-Focus Trap Broken (WCAG 2.1 Violation)",
    severity: "High",
    rootCauseSummary:
      "The Sign In dialog does not trap keyboard focus within the modal boundaries. When tabbing past the 'Close' button, focus escapes to inactive background elements, violating WCAG 2.1 Success Criterion 2.1.2.",
    verifiedFacts: [
      "Sign In dialog renders as an active overlay on top of Dashboard",
      "Focusable elements: Email input, Password input, Sign In button, Close button",
      "Pressing Tab on the 4th element (Close) moves activeElement to background page",
      "Background page elements receive focus while modal is open",
    ],
    unknownParameters: [
      "Exact modal library used (Radix, HeadlessUI, or custom implementation)",
    ],
    reproductionSteps: [
      "1. Click 'Sign In' in top navbar",
      "2. Modal dialog opens with focus on Email field",
      "3. Press Tab key 4 times through Email -> Password -> Sign In -> Close",
      "4. Press Tab once more and observe focus escaping to background DOM",
    ],
    generatedTestCode: `import { test, expect } from '@playwright/test';

test.describe('Accessibility - Dialog Focus Trap', () => {
  test('should cycle keyboard focus within modal without escaping to background', async ({ page }) => {
    await page.goto('/');

    // Open Sign In Dialog
    await page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first().click(); // Inference (verify selector in staging)
    const dialog = page.locator('[role="dialog"], .modal-dialog');
    await expect(dialog).toBeVisible();

    // Tab through all modal interactive elements
    await page.keyboard.press('Tab'); // to Password
    await page.keyboard.press('Tab'); // to Submit
    await page.keyboard.press('Tab'); // to Close
    await page.keyboard.press('Tab'); // Should wrap to Email

    // Assert activeElement is still inside dialog
    const isFocusInside = await dialog.evaluate((el) => el.contains(document.activeElement));
    expect(isFocusInside).toBe(true);
  });
});`,
    githubIssueMarkdown: `### ♿ A11y Bug: Sign In Modal Tab-Focus Escapes to Background Content

**Severity**: High (WCAG 2.1 SC 2.1.2 No Keyboard Trap violation)

#### Summary
Keyboard navigation escapes the Sign In modal dialog after the last focusable element, trapping keyboard-only and screen reader users.

#### Steps to Reproduce
1. Open Sign In modal
2. Tab through Email -> Password -> Sign In -> Close
3. Press Tab again

#### Expected
Focus wraps circularly back to the Email field.

#### Actual
Focus escapes to background dashboard elements.
`,
    jiraIssueText: `SUMMARY: [A11y] Keyboard Focus Escapes Sign In Modal Dialog (WCAG 2.1 SC 2.1.2)
ISSUE TYPE: Bug
PRIORITY: High (P2)
COMPONENT: Auth / Navigation

DESCRIPTION:
1. OVERVIEW:
Keyboard users navigating via Tab key escape the modal dialog boundary, leaving screen reader users lost in background DOM.

2. STEPS TO REPRODUCE:
1. Open Sign In modal
2. Press Tab 4 times to reach Close button
3. Press Tab once more

3. EXPECTED VS ACTUAL:
* Expected: Circular focus wrap to first input (Email).
* Actual: Focus escapes to background.
`,
    selfValidationCheck:
      "All assertions trace strictly to the observed keyboard navigation breakdown. Playwright test evaluates activeElement containment.",
  },

  "mobile-overflow": {
    bugTitle: "Landing Page Horizontal Layout Overflow on 375px Mobile Viewport",
    severity: "Medium",
    rootCauseSummary:
      "The hero section and 'Trusted by' logo strip contain fixed min-width dimensions without flex-wrapping, causing 165px horizontal layout overflow and horizontal scroll on 375px viewport devices.",
    verifiedFacts: [
      "Viewport width is set to 375px (iPhone SE standard)",
      "Hero content container extends to 540px width",
      "165px layout overflow triggers unwanted horizontal scrollbar",
      "Partner logo grid rendered with nowrap",
    ],
    unknownParameters: ["Exact CSS framework class names for the logo container"],
    reproductionSteps: [
      "1. Open landing page in mobile emulation at 375px x 667px",
      "2. Inspect the document scrollWidth vs viewport innerWidth",
      "3. Observe horizontal scrolling and clipped right-aligned hero content",
    ],
    generatedTestCode: `import { test, expect } from '@playwright/test';

test.describe('Responsive Layout - 375px Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should not exhibit horizontal overflow on 375px screen', async ({ page }) => {
    await page.goto('/');

    // Check that document scrollWidth does not exceed viewport width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});`,
    githubIssueMarkdown: `### 📱 Mobile UI Bug: Horizontal Layout Overflow on 375px Viewport

**Severity**: Medium (P3 - UI / Responsive)

#### Summary
Hero container extends to 540px on 375px viewports, causing 165px horizontal scroll overflow.

#### Steps to Reproduce
1. Emulate iPhone SE (375px width)
2. Open landing page
3. Scroll horizontally

#### Expected
Content wraps responsively within 375px.

#### Actual
Layout extends to 540px with visible overflow-x scroll.
`,
    jiraIssueText: `SUMMARY: [Mobile] 165px Horizontal Layout Overflow on 375px Viewports
ISSUE TYPE: Bug
PRIORITY: Medium (P3)
COMPONENT: Landing Page / CSS Layout

DESCRIPTION:
1. OVERVIEW:
Hero container and logo bar lack responsive wrapping on 375px screens, forcing horizontal scroll.

2. STEPS TO REPRODUCE:
1. Set viewport to 375px width
2. Navigate to landing page
3. Check horizontal scrollbar

3. EXPECTED VS ACTUAL:
* Expected: scrollWidth <= 375px
* Actual: scrollWidth = 540px (165px overflow)
`,
    selfValidationCheck:
      "All assertions verify exact viewport width vs scrollWidth based on visual evidence.",
  },
};

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

import { test, expect } from '@playwright/test';

test('Floating bubbles avoid center content area', async ({ page }) => {
  // 1. Go to the homepage
  await page.goto('/');

  // 2. Wait for bubbles to spawn (initial spawn + interval)
  // The first bubble spawns immediately, others every 2.5s. Wait for at least 3 bubbles.
  await page.waitForTimeout(6000); 

  // 3. Select all bubble elements
  // We use the selector for the container div of each bubble (the one with inline styles)
  const bubbles = page.locator('div[class*="animate-bubble"]');
  
  const count = await bubbles.count();
  console.log(`Found ${count} bubbles.`);
  
  expect(count).toBeGreaterThan(0); // Ensure bubbles are spawning

  // 4. Check position of each bubble
  for (let i = 0; i < count; ++i) {
    const bubble = bubbles.nth(i);
    const style = await bubble.getAttribute('style');
    
    // Parse 'left: 12.34%;' from style string
    const leftMatch = style?.match(/left:\s*([\d.]+)%/);
    
    if (leftMatch) {
      const leftValue = parseFloat(leftMatch[1]);
      console.log(`Bubble ${i} left position: ${leftValue}%`);

      // Define safe zones: 5-20% (Left) OR 80-95% (Right)
      // Center area to avoid: 20% < left < 80%
      const isLeftSafe = leftValue >= 5 && leftValue <= 20; 
      const isRightSafe = leftValue >= 80 && leftValue <= 95;

      const isSafe = isLeftSafe || isRightSafe;
      
      expect(isSafe, `Bubble at ${leftValue}% overlaps with center content!`).toBeTruthy();
    } else {
      console.warn(`Bubble ${i} has no left style: ${style}`);
    }
  }
});

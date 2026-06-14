const colors = require('./design-tokens/colors.placeholder.json');
const typography = require('./design-tokens/typography.placeholder.json');
const spacing = require('./design-tokens/spacing.placeholder.json');

/**
 * Placeholder Tailwind bridge for the Phase 1 scaffolds.
 * Swap these files for the synthesized brand system after #1425 merges.
 */
module.exports = {
  theme: {
    extend: {
      colors,
      fontFamily: {
        heading: typography.heading,
        body: typography.body,
      },
      spacing,
    },
  },
};

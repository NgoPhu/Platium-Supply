module.exports = {
  content: ['./src/**/*.{js,liquid}'],
  mode: 'jit',
  theme: {
    screens: {
      xs: '376px',
      sm: '640px',
      md: '768px',
      'md-max': { max: '767px' },
      'md-checkout': { min: '1000px' },
      lg: '1024px',
      'lg-max': { max: '1023px' },
      xl: '1280px',
      'xl-max': { max: '1279px' },
      '2xl': '1440px',
      '3xl': '1536px'
    },
    fontSize: {
      '5xl': ['48px', { lineHeight: '56px' }],
      '4xl': ['36px', { lineHeight: '44px' }],
      '3xl': ['30px', { lineHeight: '36px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      xl: ['20px', { lineHeight: '28px' }],
      'intro-text': ['18px', { lineHeight: '30px' }],
      lg: ['18px', { lineHeight: '24px' }],
      base: ['16px', { lineHeight: '28px' }],
      sm: ['15px', { lineHeight: '24px' }],
      med: ['14px', { lineHeight: '24px' }],
      xs: ['12px', { lineHeight: '16px' }]
    },
    fontFamily: {
      sans: ['Lato', 'sans-serif'],
      body: ['Montserrat', 'sans-serif']
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        md: '24px',
        lg: '32px',
        xl: '80px'
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#253047',
          hover: '#3D4E72'
        },
        secondary: {
          DEFAULT: '#419EA3',
          hover: '#11797E'
        },
        overlay: 'rgba(14, 23, 43, 0.16)',
        warning: {
          bg: '#FFF4E5',
          content: '#E09C31'
        },
        error: {
          bg: '#FCF3F7',
          content: '#C3000C'
        },
        success: {
          bg: '#D8F7F6',
          content: '#419EA3',
          bright: '#89CC77'
        },
        'accent-1': {
          DEFAULT: '#0ED6D3',
          hover: '#00C2C0'
        },
        'accent-2': {
          hover: '#00C2C0'
        },
        link: {
          DEFAULT: '#445069',
          hover: '#419EA3'
        },
        default: '#E8E9EA',
        grey: {
          100: '#F5F5F6',
          300: '#ECECEF',
          400: '#C8CCD0',
          500: '#6D7485',
          600: '#445069',
          900: '#343F57'
        },
        'custom-1': '#E3E3EA',
        'custom-2': '#6A2875'
      },
      backgroundImage: {
        'accent-2': 'linear-gradient(180deg, #03A6D7 0%, #73D8D5 100%)',
        'accent-3': 'linear-gradient(90deg, #419EA3 0%, #0088A3 100%)'
      },
      borderColor: {
        DEFAULT: '#E8E9EA',
        custom: '#E3E3EA',
        green: '#B5E7EA',
        focus: '#253047',
        error: '#C3000C'
      },
      boxShadow: {
        0: '0',
        base: '0px 4px 16px 6px rgba(72, 83, 84, 0.04)',
        sm: '0px 6px 24px -1px rgba(5, 12, 39, 0.04)'
      },
      maxWidth: {
        md: '704px',
        lg: '925px',
        xl: '1290px'
      },
      borderRadius: {
        none: '0px',
        sm: '0.125rem', /* 2px */
        DEFAULT: '0.25rem', /* 4px */
        md: '0.375rem', /* 6px */
        lg: '0.5rem', /* 8px */
        xl: '0.75rem', /* 12px */
        '2xl': '1rem', /* 16px */
        '3xl': '1.5rem', /* 24px */
        full: '9999px'
      }
    }
  },
  variants: {},
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')]
}

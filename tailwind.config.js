/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        nintendoBg: "#0f0f0f",
        beatPink: "#ff4dff",
        beatCyan: "#00ffff",
        beatGreen: "#1aff1a",
        nintendoGray: "#8b956d",
        darkGreen: "#0f2027"
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", 'ui-monospace', 'monospace']
      },
      boxShadow: {
        nintendo: "0 0 24px #00ffff, 0 0 8px #ff4dff",
        nintendoHover: "0 0 32px #ff4dff, 0 0 16px #00ffff",
        pixelGlow: "0 0 15px rgba(255, 77, 255, 0.8)",
        cyanGlow: "0 0 20px rgba(0, 255, 255, 0.6)"
      },
      keyframes: {
        cardIn: {
          '0%': { 
            transform: 'scale(0.8) translateY(30px)', 
            opacity: '0',
            filter: 'blur(5px)'
          },
          '100%': { 
            transform: 'scale(1) translateY(0)', 
            opacity: '1',
            filter: 'blur(0px)'
          }
        },
        slideInRight: {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        slideInLeft: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            filter: 'hue-rotate(0deg)'
          },
          '25%': { 
            transform: 'translateY(-5px) rotate(1deg)',
            filter: 'hue-rotate(90deg)'
          },
          '50%': { 
            transform: 'translateY(-10px) rotate(0deg)',
            filter: 'hue-rotate(180deg)'
          },
          '75%': { 
            transform: 'translateY(-5px) rotate(-1deg)',
            filter: 'hue-rotate(270deg)'
          }
        },
        scanline: {
          '0%': { 
            opacity: '0.1',
            transform: 'scaleY(1)'
          },
          '50%': { 
            opacity: '0.3',
            transform: 'scaleY(1.05)'
          },
          '100%': { 
            opacity: '0.1',
            transform: 'scaleY(1)'
          }
        },
        pulse: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)'
          }
        },
        glitch: {
          '0%, 100%': { 
            transform: 'translate(0)' 
          },
          '20%': { 
            transform: 'translate(-2px, 2px)' 
          },
          '40%': { 
            transform: 'translate(-2px, -2px)' 
          },
          '60%': { 
            transform: 'translate(2px, 2px)' 
          },
          '80%': { 
            transform: 'translate(2px, -2px)' 
          }
        }
      },
      animation: {
        cardIn: 'cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        slideInRight: 'slideInRight 0.5s ease-out both',
        slideInLeft: 'slideInLeft 0.5s ease-out both',
        float: 'float 4s ease-in-out infinite',
        scanline: 'scanline 2s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        glitch: 'glitch 0.3s ease-in-out'
      },
      screens: {
        'xs': '375px',
        'mobile': '480px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      }
    }
  },
  plugins: []
}

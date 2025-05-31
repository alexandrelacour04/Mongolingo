module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                'primary': '#58CC02',
                'primary-dark': '#45a100',
                'secondary': '#FF4B4B',
                'background': '#F7F7F7',
                'border': '#E5E5E5',
            },
            boxShadow: {
                'button': '0 4px 0 0 #45a100',
                'button-hover': '0 6px 0 0 #45a100',
            },
            borderRadius: {
                'xl': '12px',
            },
        }
    },
    plugins: [],
};
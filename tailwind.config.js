module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                'blue-start': '#1e3c72',
                'blue-end': '#87ceeb',
            },
            backgroundImage: {
                'blue-gradient': 'linear-gradient(135deg, var(--blue-start) 0%, var(--blue-end) 100%)',
            },
        }
    },
    plugins: [],
};
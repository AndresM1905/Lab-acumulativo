module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ec4899",
          secondary: "#9333ea",
          accent: "#f472b6",
          neutral: "#3d4451",
          "base-100": "#1f2937"
        }
      }
    ]
  }
}

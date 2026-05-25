export const welcomeTemplate = (
  name: string
) => {
  return `
    <div
      style="
        font-family: Arial;
        padding: 20px;
      "
    >
      <h1>
        Welcome ${name} 👋
      </h1>

      <p>
        Thank you for joining our store.
      </p>

      <p>
        Happy shopping 🛍️
      </p>
    </div>
  `;
};
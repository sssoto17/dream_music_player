export default async function Layout({ children }) {
  return <main className="grid md:grid-cols-2 h-screen">{children}</main>;
}

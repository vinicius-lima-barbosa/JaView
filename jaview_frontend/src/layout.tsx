import Aside from "./components/aside";
import Footer from "./components/footer";
import Header from "./components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-h-screen flex">
        <Aside />
        <main className="flex-1 flex-col">
          <div className="p-5">
            <Header />
          </div>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}

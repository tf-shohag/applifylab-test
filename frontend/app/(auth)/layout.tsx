import Script from 'next/script';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}

            {/* Bootstrap Bundle JS */}
            <Script src="/assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        </>
    );
}
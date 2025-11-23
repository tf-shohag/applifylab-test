'use client';
import Header from '@/components/feed/Header';
import MobileHeader from '@/components/feed/MobileHeader';
import MobileBottomNav from '@/components/feed/MobileBottomNav';
import ThemeSwitcher from '@/components/feed/ThemeSwitcher';
import LeftSidebar from '@/components/feed/LeftSidebar';
import RightSidebar from '@/components/feed/RightSidebar';
import ProfileMiddle from '@/components/profile/ProfileMiddle';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div className="_layout _layout_main_wrapper" suppressHydrationWarning>
                {/* Theme Switcher */}
                <ThemeSwitcher />

                <div className="_main_layout">
                    {/* Desktop Header */}
                    <Header />

                    {/* Mobile Header */}
                    <MobileHeader />

                    {/* Mobile Bottom Navigation */}
                    <MobileBottomNav />

                    {/* Main Layout Structure */}
                    <div className="container _custom_container">
                        <div className="_layout_inner_wrap">
                            <div className="row">
                                {/* Left Sidebar */}
                                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                    <LeftSidebar />
                                </div>

                                {/* Middle Content */}
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <ProfileMiddle />
                                </div>

                                {/* Right Sidebar */}
                                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                    <RightSidebar />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

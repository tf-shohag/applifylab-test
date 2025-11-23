import { useEffect, useState } from 'react';
import { logout, getStoredUser } from '@/lib/api';

export default function ProfileDropdown({ show }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <div
            id="_prfoile_drop"
            className={`_nav_profile_dropdown _profile_dropdown ${show ? 'show' : ''}`}
        >
            <div className="_nav_profile_dropdown_info">
                <div className="_nav_profile_dropdown_image">
                    <img src="/assets/images/profile.png" alt="Image" className="_nav_drop_img" />
                </div>
                <div className="_nav_profile_dropdown_info_txt">
                    <h4 className="_nav_dropdown_title">
                        {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
                    </h4>
                    <a href="/profile" className="_nav_drop_profile">
                        View Profile
                    </a>
                </div>
            </div>
            <hr />
            <ul className="_nav_dropdown_list">
                <li className="_nav_dropdown_list_item">
                    <a href="#0" className="_nav_dropdown_link">
                        <div className="_nav_drop_info">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 24 24" stroke="#377DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </span>
                            Settings
                        </div>
                        <button type="submit" className="_nav_drop_btn_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                                <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
                            </svg>
                        </button>
                    </a>
                </li>
                <li className="_nav_dropdown_list_item">
                    <a href="#0" className="_nav_dropdown_link">
                        <div className="_nav_drop_info">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                    <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19a9 9 0 100-18 9 9 0 000 18z" />
                                    <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009" />
                                </svg>
                            </span>
                            Help & Support
                        </div>
                        <button type="submit" className="_nav_drop_btn_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                                <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
                            </svg>
                        </button>
                    </a>
                </li>
                <li className="_nav_dropdown_list_item">
                    <a href="#0" className="_nav_dropdown_link" onClick={handleLogout}>
                        <div className="_nav_drop_info">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                                    <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" />
                                </svg>
                            </span>
                            Log Out
                        </div>
                        <button type="button" className="_nav_drop_btn_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                                <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
                            </svg>
                        </button>
                    </a>
                </li>
            </ul>
        </div>
    );
}
import { useEffect, useState } from 'react';
import { getStoredUser, User } from '@/lib/api';

export default function ProfileMiddle() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    if (!user) {
        return <div className="_layout_middle_wrap"><div className="_layout_middle_inner">Loading...</div></div>;
    }

    return (
        <div className="_layout_middle_wrap">
            <div className="_layout_middle_inner">
                <div className="_profile_header _b_radious6 _padd_24 _mar_b24" style={{ background: '#fff' }}>
                    <div className="_profile_cover" style={{ height: '150px', background: '#f0f2f5', borderRadius: '6px 6px 0 0' }}></div>
                    <div className="_profile_info" style={{ marginTop: '-50px', padding: '0 20px' }}>
                        <div className="_profile_img_wrap" style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <img
                                src="/assets/images/profile.png"
                                alt={user.first_name}
                                style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #fff' }}
                            />
                            <div className="_profile_txt" style={{ marginLeft: '20px', marginBottom: '10px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{user.first_name} {user.last_name}</h2>
                                <p style={{ color: '#666' }}>{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="_profile_content _b_radious6 _padd_24" style={{ background: '#fff' }}>
                    <h3>About</h3>
                    <p>Welcome to my profile!</p>
                </div>
            </div>
        </div>
    );
}

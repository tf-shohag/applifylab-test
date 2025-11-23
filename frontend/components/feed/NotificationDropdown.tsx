import { useState } from 'react';

export default function NotificationDropdown({ show }: { show: boolean }) {
    const [activeTab, setActiveTab] = useState('all');

    const notifications = [
        {
            id: 1,
            user: 'Steve Jobs',
            message: 'posted a link in your timeline.',
            time: '42 miniutes ago',
            image: '/assets/images/friend-req.png'
        },
        {
            id: 2,
            user: null,
            message: 'An admin changed the name of the group Freelacer usa to Freelacer usa',
            time: '42 miniutes ago',
            image: '/assets/images/profile-1.png'
        }
    ];

    return (
        <div
            id="_notify_drop"
            className={`_notification_dropdown ${show ? 'show' : ''}`}
        >
            <div className="_notifications_content">
                <h4 className="_notifications_content_title">Notifications</h4>
                <div className="_notification_box_right">
                    <button type="button" className="_notification_box_right_link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                            <circle cx="2" cy="2" r="2" fill="#C4C4C4"></circle>
                            <circle cx="2" cy="8" r="2" fill="#C4C4C4"></circle>
                            <circle cx="2" cy="15" r="2" fill="#C4C4C4"></circle>
                        </svg>
                    </button>
                    <div className="_notifications_drop_right">
                        <ul className="_notification_list">
                            <li className="_notification_item">
                                <span className="_notification_link">Mark as all read</span>
                            </li>
                            <li className="_notification_item">
                                <span className="_notification_link">Notifivations seetings</span>
                            </li>
                            <li className="_notification_item">
                                <span className="_notification_link">Open Notifications</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="_notifications_drop_box">
                <div className="_notifications_drop_btn_grp">
                    <button
                        className={activeTab === 'all' ? '_notifications_btn_link' : '_notifications_btn_link1'}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={activeTab === 'unread' ? '_notifications_btn_link' : '_notifications_btn_link1'}
                        onClick={() => setActiveTab('unread')}
                    >
                        Unread
                    </button>
                </div>

                <div className="_notifications_all">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="_notification_box">
                            <div className="_notification_image">
                                <img
                                    src={notifications[index % 2].image}
                                    alt="Image"
                                    className="_notify_img"
                                />
                            </div>
                            <div className="_notification_txt">
                                <p className="_notification_para">
                                    {notifications[index % 2].user && (
                                        <span className="_notify_txt_link">
                                            {notifications[index % 2].user}
                                        </span>
                                    )}
                                    {notifications[index % 2].message}
                                </p>
                                <div className="_nitification_time">
                                    <span>{notifications[index % 2].time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default function StoriesSection() {
    const stories = [
        { id: 1, name: 'Ryan Roslansky', image: '/assets/images/card_ppl2.png', mini: '/assets/images/mini_pic.png', active: true },
        { id: 2, name: 'Ryan Roslansky', image: '/assets/images/card_ppl3.png', mini: '/assets/images/mini_pic.png', active: false },
        { id: 3, name: 'Ryan Roslansky', image: '/assets/images/card_ppl4.png', mini: '/assets/images/mini_pic.png', active: false }
    ];

    const mobileStories = [
        { id: 1, name: 'Ryan...', image: '/assets/images/mobile_story_img1.png', active: true },
        { id: 2, name: 'Ryan...', image: '/assets/images/mobile_story_img2.png', active: false },
        { id: 3, name: 'Ryan...', image: '/assets/images/mobile_story_img1.png', active: true }
    ];

    return (
        <>
            {/* Desktop Stories */}
            <div className="_feed_inner_ppl_card _mar_b16">
                <div className="_feed_inner_story_arrow">
                    <button type="button" className="_feed_inner_story_arrow_btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                            <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                        </svg>
                    </button>
                </div>
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                        <div className="_feed_inner_profile_story _b_radious6">
                            <div className="_feed_inner_profile_story_image">
                                <img src="/assets/images/card_ppl1.png" alt="Image" className="_profile_story_img" />
                                <div className="_feed_inner_story_txt">
                                    <div className="_feed_inner_story_btn">
                                        <button className="_feed_inner_story_btn_link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                                <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="_feed_inner_story_para">Your Story</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {stories.map((story) => (
                        <div key={story.id} className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                            <div className="_feed_inner_public_story _b_radious6">
                                <div className="_feed_inner_public_story_image">
                                    <img src={story.image} alt="Image" className="_public_story_img" />
                                    <div className="_feed_inner_pulic_story_txt">
                                        <p className="_feed_inner_pulic_story_para">{story.name}</p>
                                    </div>
                                    <div className="_feed_inner_public_mini">
                                        <img src={story.mini} alt="Image" className="_public_mini_img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Stories */}
            <div className="_feed_inner_ppl_card_mobile _mar_b16">
                <div className="_feed_inner_ppl_card_area">
                    <ul className="_feed_inner_ppl_card_area_list">
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <div className="_feed_inner_ppl_card_area_story">
                                    <img src="/assets/images/mobile_story_img.png" alt="Image" className="_card_story_img" />
                                    <div className="_feed_inner_ppl_btn">
                                        <button className="_feed_inner_ppl_btn_link" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                                                <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
                            </a>
                        </li>
                        {mobileStories.map((story) => (
                            <li key={story.id} className="_feed_inner_ppl_card_area_item">
                                <a href="#0" className="_feed_inner_ppl_card_area_link">
                                    <div className={story.active ? "_feed_inner_ppl_card_area_story_active" : "_feed_inner_ppl_card_area_story_inactive"}>
                                        <img src={story.image} alt="Image" className="_card_story_img1" />
                                    </div>
                                    <p className="_feed_inner_ppl_card_area_txt">{story.name}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
import React from 'react'
import Category from '../components/ShowCaseSection/Category'
import BannerSection from '../components/ShowCaseSection/BannerSection'
import MusicHeroSection from '../components/ShowCaseSection/MusicHeroSection'
import BrandsHero from '../components/ShowCaseSection/BrandsHero'

const Home = () => {
  return (
    <div>
      <Category />
     
      <BannerSection />
      <MusicHeroSection />
      {/* <BrandsHero /> */}
    </div>
  )
}

export default Home
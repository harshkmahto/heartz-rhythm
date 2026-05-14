import React from 'react'
import Category from '../components/ShowCaseSection/Category'
import MusicHeroSection from '../components/ShowCaseSection/MusicHeroSection'
import ProductsGrid from '../components/ShowCaseSection/ProductsGrid'
import Banner from '../components/ShowCaseSection/Banner'
import ComingSoonProducts from '../components/ShowCaseSection/ComingSoonProducts'
import FeaturedProducts from '../components/ShowCaseSection/FeatuedProducts'
import AboutSection from '../components/ShowCaseSection/AboutSection'
import FAQ from '../components/ShowCaseSection/FQA'
import Brands from '../components/ShowCaseSection/Brands'
import DiscountProducts from '../components/ShowCaseSection/DiscountProducts'
import RoleButtonHero from '../components/ShowCaseSection/RoleButtonHero'

const Home = () => {
  return (
    <div className='min-h-screen'>
      <Category />
     
      <Banner/>
      <ProductsGrid />
      <ComingSoonProducts/>
      <RoleButtonHero/>
      <MusicHeroSection />
   
      <FeaturedProducts/>
      <DiscountProducts/>
      <Brands/>
      <AboutSection/>
      <FAQ/>
   
    </div>
  )
}

export default Home
import crew from '../assets/image/jayjays-team.jpg';

const Hero = (props) => {
  return (
    <section 
        className="bg-cover py-80 mb-12 h-auto"
        style={{ 
            backgroundImage: `url(${crew})`,
            backgroundPosition: 'center 20%',
        }}
    >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
        >
          <div className="text-center">
            <h1
              className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl"
            >
              { props.title }
            </h1>
            <p className="my-4 text-xl text-white">
              { props.subtitle }
            </p>
          </div>
        </div>
      </section>
  )
}

export default Hero
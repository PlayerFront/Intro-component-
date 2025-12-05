import Form from '../ui/Form/Form';
import './_intro-component.scss';

const IntroComponent = () => {
  return (
    <section className='intro-component' id='intro-component'>
      <div className='intro-component__description'>
        <h1 className='intro-component__title'>Learn to code by watching others</h1>
        <p className='intro-component__subtitle'>See how experienced developers solve problems in real-time. Watching scripted tutorials is great, but understanding how developers think is invaluable.</p>
      </div>
      <Form />
      {/* Здесь импорт primary button и form внутри конторой secondary button */}
    </section>
  );
};

export default IntroComponent;
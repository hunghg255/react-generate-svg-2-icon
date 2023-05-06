import {
  IconAccountBook,
  IconAlert,
  IconAlipayCircle,
  IconAliwangwang,
  IconAmazonCircle,
  IconAndroid,
  IconCalendar,
  IconReact,
  IconStar,
} from '@/components/Icon';
import './App.css';
import GithubCorners from 'react-gh-corners';

function App() {
  return (
    <>
      <IconCalendar
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'red',
        }}
      />
      <IconAccountBook
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'blue',
        }}
      />
      <IconAlert
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'green',
        }}
      />
      <IconAlipayCircle
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'yellow',
        }}
      />
      <IconAliwangwang
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'violet',
        }}
      />
      <IconAndroid
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'red',
        }}
      />
      <IconReact
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'blue',
        }}
      />

      <IconAmazonCircle
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
          color: 'red',
        }}
      />

      <IconStar
        onClick={() => alert('Hello')}
        style={{
          fontSize: 50,
        }}
      />

      <GithubCorners position='right' href='https://github.com/hunghg255/svg-to-jsx' />
    </>
  );
}

export default App;

import Link from 'next/link';
import Image from 'next/image';

/// const FooterLinks = [
///   { href: '/', key: 'For designers', text: 'For designers' },
///   { href: '/', key: 'Hire talent', text: 'Hire talent' },
///   { href: '/', key: 'Inspiration', text: 'Inspiration' },
///   { href: '/', key: 'Advertising', text: 'Advertising' },
///   { href: '/', key: 'Blog', text: 'Blog' },
///   { href: '/', key: 'About', text: 'About' },
///   { href: '/', key: 'Careers', text: 'Careers' },
///   { href: '/', key: 'Support', text: 'Support' }
/// ];

export default function Footer() {
  return (
    <footer className='max-w-[1200px] mx-auto box-content px-8'>
      <div className='flex flex-col lg:flex-row justify-between items-center pt-[72px] pb-11 gap-5 lg:gap-0'>
        <Link href='/'>
          <Image
            src='/photorio-logo.svg'
            alt='photorio logo'
            className='w-[230px] h-[105px]'
            width={230}
            height={105}
          />
        </Link>
        <div className='grid grid-flow-col gap-4'>
          <Link href='/'>
            <Image
              src='/twitter.svg'
              alt='twitter logo'
              width={18}
              height={18}
            />
          </Link>
          <Link href='/'>
            <Image
              src='/facebook.svg'
              alt='facebook logo'
              width={18}
              height={18}
            />
          </Link>
          <Link href='/'>
            <Image
              src='/instagram.svg'
              alt='instagram logo'
              width={18}
              height={18}
            />
          </Link>
          <Link href='/'>
            <Image
              src='/pinterest.svg'
              alt='pinterest logo'
              width={18}
              height={18}
            />
          </Link>
        </div>
      </div>
      <div className='flex flex-col md:flex-row py-11 items-center justify-between text-sm leading-5 text-muted-foreground gap-y-4'>
        <ul className='flex flex-wrap justify-center text-sm gap-x-4 gap-y-1 xl:gap-8'>
          <li>
            &copy; {new Date().getFullYear()} Photorio. Created by{' '}
            <Link
              href='/'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium hover:underline underline-offset-4'
            >
              Group 6 SEPM
            </Link>            .
          </li>
        </ul>
      </div>
    </footer>
  );
}

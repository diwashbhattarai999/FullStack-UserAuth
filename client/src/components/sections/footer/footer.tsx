import MaxWidthContainer from '@/components/common/max-width-container';

const Footer = () => {
  return (
    <footer className="relative border-t border-border">
      <MaxWidthContainer className="flex justify-between flex-col z-10">
        {/* Bottom - Copyright */}
        <div className="border-t border-t-border/70 flex items-center justify-center text-center py-4 text-xs md:text-sm max-sm:flex-col max-sm:gap-2">
          <p>Copyright &copy; 2024 Diwash Bhattarai. All Rights Reserved. Handigaun, Kathmandu</p>
        </div>
      </MaxWidthContainer>
    </footer>
  );
};

export default Footer;

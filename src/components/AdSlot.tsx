interface Props {
  slot: 'ad-top' | 'ad-bottom' | 'ad-sidebar';
}

export default function AdSlot({ slot }: Props) {
  const sizeClass = slot === 'ad-sidebar' ? 'ad-slot-sidebar' : 'ad-slot-top';

  return (
    <div
      className={`ad-slot flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs ${sizeClass}`}
      data-no-print
      aria-hidden="true"
    >
      {/*
        Replace with your real AdSense unit after approval:

        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
      <span>[ Ad — {slot} ]</span>
    </div>
  );
}

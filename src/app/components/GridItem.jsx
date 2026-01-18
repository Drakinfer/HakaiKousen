'use client';

export default function GridItem({
  as = 'div', // 'div' | 'a'
  href,
  download,
  target,
  rel,
  title,

  icon = null,
  primary = '',
  secondary = '',

  className = '',
  iconClassName = '',
  primaryClassName = '',
  secondaryClassName = '',

  onClick,
}) {
  const Comp = as;

  const base =
    'group transition p-3 flex flex-col items-center gap-2 rounded-lg hover:bg-neutral-50';
  const iconBase =
    'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center';
  const primaryBase =
    'text-xs sm:text-sm font-medium text-center line-clamp-2 break-words';
  const secondaryBase =
    'text-xs sm:text-sm text-neutral-600 text-center line-clamp-2 break-words';

  const props =
    as === 'a'
      ? { href, download, target, rel, title, onClick }
      : { title, onClick };

  return (
    <Comp className={`${base} ${className}`.trim()} {...props}>
      {icon !== null && (
        <div className={`${iconBase} ${iconClassName}`.trim()}>{icon}</div>
      )}

      {primary ? (
        <p className={`${primaryBase} ${primaryClassName}`.trim()}>
          {primary}
        </p>
      ) : null}

      {secondary ? (
        <p className={`${secondaryBase} ${secondaryClassName}`.trim()}>
          {secondary}
        </p>
      ) : null}
    </Comp>
  );
}

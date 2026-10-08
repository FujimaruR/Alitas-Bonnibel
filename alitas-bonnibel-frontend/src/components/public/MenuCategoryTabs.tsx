import { useLocale as useSiteLocale, text as localizeText } from '../../site/locale';
type Category = {
  id: string;
  label: string;
  emoji: string;
};

type Props = {
  categories: Category[];
};

export function MenuCategoryTabs({ categories }: Props) {
  useSiteLocale();
  return (
    <div className="sticky top-20 z-20">
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="
            rounded-3xl bg-white/85 backdrop-blur
            border border-slate-200
            shadow-lg shadow-black/10
            px-3 py-2
            overflow-x-auto
          "
        >
          <div className="flex gap-2 min-w-max">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-2xl
                  text-sm font-extrabold
                  border border-slate-200
                  bg-white
                  hover:bg-slate-900 hover:text-white
                  transition
                  whitespace-nowrap
                "
              >
                <span>{localizeText(c.emoji)}</span>
                {localizeText(c.label)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

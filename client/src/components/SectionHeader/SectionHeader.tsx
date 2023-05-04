import './style.scss';

interface Props {
  text: string;
}

export default function SectionHeader({ text }: Props) {
  return (
    <div className="ma-section-header">
      <p>{text}</p>
    </div>
  );
}

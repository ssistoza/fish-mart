export default function Page(props: IPageProps) {
  return (
    <div>
      <h2>I am the page component</h2>
      {props.children}
    </div>
  );
}

export interface IPageProps {
  children?: JSX.Element | JSX.Element[];
}

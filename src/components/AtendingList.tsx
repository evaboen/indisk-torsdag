import { ProfilePictureAndName } from "./PrfilePictreAndName";

interface IProps {
  header: string;
  emails?: string[];
}

export const AttendingList = ({ header, emails = [] }: IProps) => {
  const count = emails.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <b>
        {count > 0
          ? `${header} (${count}):`
          : `...ingen ${header.toLowerCase()} :(`}
      </b>

      {emails.map((email) => (
        <ProfilePictureAndName
          key={email}
          notBold
          imageSize={30}
          email={email}
        />
      ))}
    </div>
  );
};

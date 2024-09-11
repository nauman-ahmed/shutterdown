import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import BASE_URL from "../../API";

Font.register({
  family: "brownSugar",
  src: "/fonts/brown-sugar.ttf",
});
Font.register({
  family: "openSauceMedium",
  src: "/fonts/OpenSauceOne-Medium.ttf",
});
Font.register({
  family: "openSauceRegular",
  src: "/fonts/OpenSauceOne-Regular.ttf",
});
Font.register({
  family: "openSauceBold",
  src: "/fonts/OpenSauceOne-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "#fbf6f3",
  },
  container: {
    width: "100%",
    paddingHorizontal: 15,
    margin: "0 auto",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 30,
    justifyContent: "center",
  },
  logoImage: {
    width: 90,
    height: 60,
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  colOneThird: {
    flexBasis: "27%",
    maxWidth: "27%",
    height: 340,
  },
  textCenter: {
    textAlign: "center",
  },
  heading: {
    fontFamily: "brownSugar",
    fontSize: 70,
    marginVertical: 20,
    marginBottom: 40,
    color: "#5d3f26",
  },
  memberImage: {
    width: "100%",
    height: "100%",
    marginHorizontal: "auto",
    borderRadius : 10
  },
  memberImageBox: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    overflow: "hidden",

  },
  nameFont: {
    fontSize: 12,
    marginVertical: 4,
    fontFamily: "openSauceMedium",
    color: "#3a4452",
  },
  designationText: {
    fontSize: 14,
    fontFamily: "openSauceBold",
    color: "#3a4452",
    width: "100%",
    padding: 5,
    backgroundColor: "#f7ece6",
    borderWidth: 1,
    borderColor: "#000000",
    borderStyle: "solid",
    borderRadius: 8,
    marginVertical: 8,
    fontWeight: "bold",
  },
  description: {
    fontSize: "9px",
    paddingHorizontal: 8,
    lineHeight: 1.2,
    fontFamily: "openSauceRegular",
  },
});

const TeamPDF = ({ team, client }) => {
  // Combine all users into a single array
  const users = [
    ...(client ? [{ ...client.userID, role: 'Team Leader' }] : []),
    ...team.shootDirectors?.map(user => ({ ...user, role: 'Shoot Director' })) || [],
    ...team.choosenPhotographers?.map(user => ({ ...user, role: 'Photographer' })) || [],
    ...team.choosenCinematographers?.map(user => ({ ...user, role: 'Cinematographer' })) || [],
    ...team.droneFlyers?.map(user => ({ ...user, role: 'Drone Flyer' })) || [],
    ...team.manager?.map(user => ({ ...user, role: 'Manager' })) || [],
    ...team.assistants?.map(user => ({ ...user, role: 'Assistant' })) || [],
    ...team.sameDayPhotoMakers?.map(user => ({ ...user, role: 'Same Day Photo Maker' })) || [],
    ...team.sameDayVideoMakers?.map(user => ({ ...user, role: 'Same Day Video Maker' })) || []
  ];

  // Paginate users: First page shows 3, subsequent pages show 6
  const firstPageUsers = users.slice(0, 3);
  const subsequentPagesUsers = users.slice(3);

  // Split subsequent users into groups of 6 per page
  const groupedUsers = [];
  for (let i = 0; i < subsequentPagesUsers.length; i += 6) {
    groupedUsers.push(subsequentPagesUsers.slice(i, i + 6));
  }

  const renderUser = (user) => (
    <View style={styles.colOneThird}>
      <View style={styles.memberImageBox}>
        {user?.photo ? (
          <Image style={styles.memberImage} src={BASE_URL + "/preview-file/" + user?.photo} />
        ) : (
          <Text style={styles.textCenter}>
            {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
          </Text>
        )}
      </View>
      <Text style={[styles.textCenter, styles.nameFont]}>
        {user?.firstName + " " + user?.lastName}
      </Text>
      <Text style={[styles.textCenter, styles.designationText]}>
        {user?.role}
      </Text>
      <Text style={[styles.textCenter, styles.description]}>
        {user?.about}
      </Text>
    </View>
  );

  
  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page}>
        <Image style={styles.logoImage} src={"/images/pdfLogo.png"} />
        <Text style={[styles.heading, styles.textCenter]}>MEET OUR TEAM</Text>
        <View style={[styles.row, { flexWrap: "wrap" }]}>
          {firstPageUsers.map((user, ind) => renderUser(user))}
        </View>
      </Page>

      {/* Subsequent Pages */}
      {groupedUsers.map((pageUsers, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={[styles.row, { flexWrap: "wrap" }]}>
            {pageUsers.map((user, ind) => renderUser(user))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TeamPDF;

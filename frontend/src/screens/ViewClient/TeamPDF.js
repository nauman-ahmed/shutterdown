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
    paddingHorizontal: 20,
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
    gap: 6,
    justifyContent: "center",
  },
  logoImage: {
    width: 90,
    height: 60,
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  colOneThird: {
    flexBasis: "30%",
    maxWidth: "30%",
    paddingHorizontal: 15,
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
    width: "85%",
    height: "100%",
    marginHorizontal: "auto",
  },
  memberImageBox: {
    width: "100%",
    height: 200,
    borderRadius: 10,
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
    borderRadius: 5,
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

const TeamPDF = ({ team, client }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.logoImage} src={"/images/pdfLogo.png"} />
      <Text style={[styles.heading, styles.textCenter]}>MEET OUR TEAM</Text>

      {/* Wrap the entire content in a view with wrap set to true */}
      <View style={[styles.row, { flexWrap: "wrap" }]}>
        {client && (
          <View style={styles.colOneThird}>
            <View style={styles.memberImageBox}>
              {client?.userID?.photo ? (
                <Image
                  style={styles.memberImage}
                  src={BASE_URL + "/" + client?.userID?.photo}
                />
              ) : (
                <Text style={styles.textCenter}>
                  {`${client?.userID?.firstName
                    .charAt(0)
                    .toUpperCase()}${client?.userID?.lastName
                    .charAt(0)
                    .toUpperCase()}`}
                </Text>
              )}
            </View>
            <Text style={[styles.textCenter, styles.nameFont]}>
              {client.userID?.firstName + " " + client.userID?.lastName}
            </Text>
            <Text style={[styles.textCenter, styles.designationText]}>
              Team Leader
            </Text>
            <Text style={[styles.textCenter, styles.description]}>
              {client.userID?.About}
            </Text>
          </View>
        )}

        {/* Other team members rendering */}
        {team?.shootDirectors?.length > 0 &&
          team.shootDirectors.map((user, ind) => (
            <View key={ind} style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Shoot Director
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}

        {team?.choosenPhotographers?.length > 0 &&
          team?.choosenPhotographers?.map((user, ind) => (
            <View style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Photographer
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}

        {team?.choosenCinematographers?.length > 0 &&
          team?.choosenCinematographers?.map((user, ind) => (
            <View style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Cinematographer
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}

        {team?.droneFlyers?.length > 0 &&
          team?.droneFlyers?.map((user, ind) => (
            <View style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Drone Flyer
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}

        {team?.manager?.length > 0 &&
          team?.manager?.map((user, ind) => (
            <View style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Manager
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}

        {team?.assistants?.length > 0 &&
          team?.assistants?.map((user, ind) => (
            <View style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Assistant
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}

        {team?.sameDayPhotoMakers?.length > 0 &&
          team?.sameDayPhotoMakers?.map((user, ind) => (
            <View style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Same Day Photo Maker
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}

        {team?.sameDayVideoMakers?.length > 0 &&
          team?.sameDayVideoMakers?.map((user, ind) => (
            <View style={styles.colOneThird}>
              <View style={styles.memberImageBox}>
                {user?.photo ? (
                  <Image
                    style={styles.memberImage}
                    src={BASE_URL + "/" + user?.photo}
                  />
                ) : (
                  <Text style={styles.textCenter}>
                    {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
                      .charAt(0)
                      .toUpperCase()}`}
                  </Text>
                )}
              </View>
              <Text style={[styles.textCenter, styles.nameFont]}>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text style={[styles.textCenter, styles.designationText]}>
                Same Day Video Maker
              </Text>
              <Text style={[styles.textCenter, styles.description]}>
                {user?.About}
              </Text>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

export default TeamPDF;

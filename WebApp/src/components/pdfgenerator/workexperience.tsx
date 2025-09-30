import { View, Text, StyleSheet } from '@react-pdf/renderer';

const style = StyleSheet.create({
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#05afc9',
  },
  projectNameContainer: { marginBottom: 10 },
  position: {
    fontWeight: 'bold',
  },
  tenureship: {
    color: '#6b7280',
    fontSize: 8,
    marginLeft: 8,
  },
  description: { marginTop: 8 },
});

const WorkExperience = ({ projects }: CVFormProjectsData) => (
  <View>
    {projects &&
      projects.length > 0 &&
      projects.map((project, idx) => (
        <View key={`${idx} - ${project.title}`} style={style.projectNameContainer}>
          <Text style={style.projectName}>{project.title}</Text>
          <View style={{ marginTop: 12, marginBottom: 12 }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={style.position}>{project.role}</Text>
              <View style={style.tenureship}>
                <Text>{project.date}</Text>
              </View>
            </View>
            <Text style={style.description}>{project.projectDetails}</Text>
          </View>
        </View>
      ))}
  </View>
);

export default WorkExperience;

import { colors, radii, spacing, typography } from '@/constants/theme';
import { AdminDashboardCards } from '@/models';
import { Octicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    overview?: any; // use whatever your overview type is called
};
export function AdminCards({ overview }: Props) {
    const carddetails: AdminDashboardCards[] = [
        {
            title: 'Punched In',
            count: overview?.punchedIn ?? 0,
            icon: 'check-circle',
            percentage: String(overview?.punchedInChangePercent ?? 0),
            color: 'success',
        },
        {
            title: 'Late Punches',
            count: overview?.latePunches ?? 0,
            icon: 'clock',
            percentage: String(overview?.latePunchesChangePercent ?? 0),
            color: 'textBrown',
        },
        {
            title: 'Absentees',
            count: overview?.absences ?? 0,
            icon: 'circle-slash',
            percentage: '—',
            color: 'danger',
        },
        {
            title: 'With Permission',
            count: overview?.withPermission ?? 0,
            icon: 'shield-check',
            percentage: '—',
            color: 'primary',
        },
    ];
    return (
        <View className='flex-row flex-wrap mb-3 '>
            {carddetails.map((card) => (
                <View className="w-1/2 p-1.5  md:w-1/4" key={`${card.title}-${card.count}`} >
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>

                            <View style={[styles.iconBox, { backgroundColor: `${colors[card.color]}12` }]}>
                                <Octicons style={styles.icon} name={card.icon} size={20} color={colors[card.color]} />
                            </View>

                            <View style={[styles.badge, { backgroundColor: `${colors[card.color]}12` }]}>
                                <Text style={[styles.badgeText, { color: colors[card.color] }]} >{card.percentage}</Text>
                            </View>
                        </View>

                        <Text style={styles.count}>{card.count}</Text>
                        <Text style={styles.label}>{card.title}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

}
const styles = StyleSheet.create({
    card: {
        minHeight: 174,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        borderColor: '#EEF0F5',
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },

    iconBox: {
        width: 41,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#E8EFF7',
        alignItems: 'center',
        justifyContent: 'center',
    },

    icon: {
        fontSize: 23,
    },

    badge: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 12,
    },

    badgeText: {
        fontSize: 10,
        fontWeight: '600',
    },

    count: {
        fontSize: 36,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 42,
    },

    label: {
        fontSize: 13,
        color: '#172554',
        marginTop: 2,
    },

});

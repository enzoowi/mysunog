import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { IncidentsService } from './incidents/incidents.service';
import { EducationService } from './education/education.service';
import { UserRole } from './users/user.entity';
import { EducationCategory } from './education/education.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const incidentsService = app.get(IncidentsService);
  const educationService = app.get(EducationService);

  console.log('Seeding BFP Admin User...');
  const existingAdmin = await usersService.findByEmail('admin@bfp.gov.ph');
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await usersService.create({
      email: 'admin@bfp.gov.ph',
      password: hashedPassword,
      role: UserRole.ADMIN,
      fullName: 'BFP Chief Administrator',
      isVerified: true, // Admin is always verified
    });
    console.log('Admin user created: admin@bfp.gov.ph / admin123');
  } else {
    // Ensure existing admin is always verified (handles migration case)
    if (!existingAdmin.isVerified) {
      existingAdmin.isVerified = true;
      await usersService.save(existingAdmin);
      console.log('Existing admin account marked as verified.');
    } else {
      console.log('Admin user already exists.');
    }
  }

  console.log('Seeding 5 Mock Incidents...');
  const mockIncidents = [
    {
      barangay: 'Poblacion',
      remarks: 'Fire started in the kitchen of a local restaurant',
      cause: 'Unattended Cooking',
      propertyType: 'Commercial',
      estimatedDamage: 150000,
      casualties: 0,
      injuries: 1,
      incidentDate: '2026-03-20',
      incidentTime: '14:30',
      alarmTime: '14:35',
      responseTime: '14:45',
      controlTime: '15:20',
      fireOutTime: '15:45',
      latitude: 14.0415,
      longitude: 121.1575,
    },
    {
      barangay: 'San Juan',
      remarks: 'Electrical fire in a residential apartment building',
      cause: 'Faulty Wiring',
      propertyType: 'Residential',
      estimatedDamage: 300000,
      casualties: 0,
      injuries: 2,
      incidentDate: '2026-03-18',
      incidentTime: '23:15',
      alarmTime: '23:20',
      responseTime: '23:28',
      controlTime: '00:10',
      fireOutTime: '01:00',
      latitude: 14.046,
      longitude: 121.156,
    },
    {
      barangay: 'Luta del Norte',
      remarks: 'Grass fire near the highway causing poor visibility',
      cause: 'Discarded Cigarette',
      propertyType: 'Outdoor',
      estimatedDamage: 5000,
      casualties: 0,
      injuries: 0,
      incidentDate: '2026-03-15',
      incidentTime: '13:00',
      alarmTime: '13:10',
      responseTime: '13:25',
      controlTime: '14:00',
      fireOutTime: '14:15',
      latitude: 14.055,
      longitude: 121.155,
    },
    {
      barangay: 'San Pioquinto',
      remarks: 'Industrial warehouse chemical spill leading to fire',
      cause: 'Chemical Reaction',
      propertyType: 'Industrial',
      estimatedDamage: 1200000,
      casualties: 1,
      injuries: 4,
      incidentDate: '2026-03-10',
      incidentTime: '09:45',
      alarmTime: '09:48',
      responseTime: '09:55',
      controlTime: '11:30',
      fireOutTime: '13:00',
      latitude: 14.048,
      longitude: 121.162,
    },
    {
      barangay: 'San Fernando',
      remarks: 'Minor fire in a school laboratory during an experiment',
      cause: 'Accidental',
      propertyType: 'Educational',
      estimatedDamage: 25000,
      casualties: 0,
      injuries: 0,
      incidentDate: '2026-03-05',
      incidentTime: '10:15',
      alarmTime: '10:18',
      responseTime: '10:25',
      controlTime: '10:35',
      fireOutTime: '10:45',
      latitude: 14.039,
      longitude: 121.156,
    },
  ];

  for (const incident of mockIncidents) {
    await incidentsService.create(incident as any);
  }
  console.log('Seeded 5 mock incidents.');

  console.log('Seeding Education Hub Data...');
  const educationArticles = [
    {
      title: 'Understanding the Fire Triangle',
      category: EducationCategory.GENERAL,
      content:
        'Fire needs three elements to burn: Heat, Fuel, and Oxygen. These three form the Fire Triangle. Removing any single element will extinguish the fire. \n\n1. Heat: Even a small spark holds enough heat to ignite certain fuels.\n2. Fuel: Any combustible material like paper, oils, wood, or gases.\n3. Oxygen: Fire needs at least 16% oxygen to actively burn. \n\nLearning to recognize and mitigate these elements in your environment is the first step to comprehensive fire safety.',
    },
    {
      title: 'Top 5 Causes of Electrical Fires',
      category: EducationCategory.PREVENTION,
      content:
        'Electrical fires are one of the leading causes of residential building fires. Avoid these top 5 mistakes:\n\n1. Overloaded Outlets: Do not plug too many high-wattage appliances into a single extension cord.\n2. Frayed Cords: Inspect appliance cords regularly and replace them if damaged.\n3. Outdated Wiring: Homes older than 20 years might not have the electrical capacity to handle modern appliances.\n4. Space Heaters: Keep space heaters at least 3 feet away from combustible materials such as curtains or beds.\n5. Octopus Connections: Using multiple adapters on one socket is extremely dangerous. Hire a qualified electrician to install more outlets instead.',
    },
    {
      title: 'How to Handle Your LPG Cylinders Safely',
      category: EducationCategory.LPG,
      content:
        'LPG is convenient but highly flammable. Always follow these precautions at home or your business:\n\n- Storage: Store cylinders in a well-ventilated location, ideally outside a residential unit.\n- Upright Position: Always keep the tank securely upright.\n- Ventilation: Never place tanks in basements or confined areas as LPG gas is heavier than air and will accumulate at the bottom.\n- Leak Checks: Use soapy water applied to the valve and hose connection to check for leaks. If bubbles form, there is a leak!\n- If you smell gas, DO NOT turn on or off any electrical switches. Open windows and doors, and turn off the main valve of the cylinder.',
    },
    {
      title: 'Emergency: What to do when trapped by fire',
      category: EducationCategory.EMERGENCY,
      content:
        'If you are caught in a fire emergency, fast and clear thinking can save your life.\n\n- Crawl Low: Smoke rises, so the cleanest air is near the floor. Crawl on your hands and knees to the nearest exit.\n- Feel the Door: Before opening any door, feel it with the back of your hand. If it is hot, do not open it. The fire is on the other side.\n- Stop, Drop, and Roll: If your clothes catch fire, STOP where you are, DROP to the ground, cover your face, and ROLL heavily back and forth to smother the flames.\n- Never Go Back Inside: Once you are safely out, stay out! Do not go back for pets or valuables. Alert the arriving firefighters instead.',
    },
    {
      title: 'Why Every Home Needs a Smoke Alarm',
      category: EducationCategory.HOME_SAFETY,
      content:
        'Smoke alarms are the most effective early warning system for fires and can halve the risk of dying in a home fire.\n\n- Placement: Install smoke alarms inside every bedroom, outside each sleeping area, and on every level of the home.\n- Testing: Test your smoke alarms at least once a month by pressing the test button.\n- Batteries: Replace the batteries at least once a year. If the alarm "chirps," it means the battery is low and needs immediate replacement.\n- Fire Extinguishers: Keep a multi-purpose (ABC) fire extinguisher in the kitchen, garage, and near an exit. Ensure all family members know how to use it (using the PASS method: Pull, Aim, Squeeze, Sweep).',
    },
  ];

  for (const article of educationArticles) {
    await educationService.create(article);
  }
  console.log('Seeded 5 fire safety education articles.');

  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding complete!'))
  .catch((err) => {
    console.error('Seeding failed!', err);
    process.exit(1);
  });

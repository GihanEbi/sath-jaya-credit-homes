import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Credit Users",
        icon: Icons.Alphabet,
        items: [
          {
            title: "All Users",
            url: "/credit_users/all_users",
          },
          {
            title: "All User Groups",
            url: "/credit_users/all_user_groups",
          },
        ],
      },
      {
        title: "Loan Details",
        icon: Icons.FourCircle,
        items: [
          {
            title: "New Loan",
            url: "/loan_details/new_loan",
          },
          {
            title: "All Loans",
            url: "/loan_details/all_loans",
          },
          {
            title: "Pending Loans",
            url: "/loan_details/pending_loans",
          },
          {
            title: "Ongoing Loans",
            url: "/loan_details/ongoing_loans",
          },
        ],
      },
      {
        title: "Admin Users",
        icon: Icons.User,
        items: [
          {
            title: "Users",
            url: "/users",
          },
          {
            title: "User Groups",
            url: "/users/user_groups",
          },
          {
            title: "Group Rules",
            url: "/users/group_rules",
          },
        ],
      },
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      // {
      //   title: "Profile",
      //   url: "/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
      // {
      //   title: "Forms",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Form Elements",
      //       url: "/forms/form-elements",
      //     },
      //     {
      //       title: "Form Layout",
      //       url: "/forms/form-layout",
      //     },
      //   ],
      // },
      // {
      //   title: "Tables",
      //   url: "/tables",
      //   icon: Icons.Table,
      //   items: [
      //     {
      //       title: "Tables",
      //       url: "/tables",
      //     },
      //   ],
      // },
      // {
      //   title: "Pages",
      //   icon: Icons.Alphabet,
      //   // url: "/pages/settings",
      //   items: [
      //     {
      //       title: "Settings",
      //       url: "/pages/settings",
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/auth/sign-in",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

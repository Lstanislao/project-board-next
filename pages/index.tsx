import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Layout } from "../components/layouts";
import styles from "../styles/Home.module.css";
import { EntryList } from "../components/ui/EntryList";
import { NewEntry } from "../components/ui";

const HomePage: NextPage = () => {
  return (
    <Layout title={"Home -OpenJira"}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: "calc(100vh - 180px)" }}>
            <CardHeader title="Pendientes" />
            <NewEntry />
            <EntryList status="pending" />
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: "calc(100vh - 100px)" }}>
            <CardHeader title="En progreso" />
            <EntryList status="in-progress" />
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: "calc(100vh - 100px)" }}>
            <CardHeader title="Completadas" />
            <EntryList status="finished" />
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;
